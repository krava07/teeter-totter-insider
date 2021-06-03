import Vue from 'vue'
import Vuex from 'vuex'
import {
  MIN_WEIGHT,
  MAX_WEIGHT,
  TEETER_TOTTER_WIDTH,
  FIGURE_TYPES,
  MAX_SIDES_DIFFERENCE,
  FALL_TIMEOUT,
  FALLING_FIGURES_COUNT,
  FALL_DELTA_PX,
  MAX_BENDING,
  FALL_TIMEOUT_DECREASING
} from '../config'
import { v4 as uuidv4 } from 'uuid'

Vue.use(Vuex)

const generateFigure = () => {
  const typeIdx = Math.floor(Math.random() * FIGURE_TYPES.length)
  const weight = Math.floor(Math.random() * MAX_WEIGHT) + MIN_WEIGHT
  const size = weight * 10
  const top = size

  return {
    id: uuidv4(),
    type: FIGURE_TYPES[typeIdx],
    weight,
    offset: Math.floor(Math.random() * TEETER_TOTTER_WIDTH / 2) + 1,
    size,
    top,
    bottomCoord: 0,
    offsetBottom: 0
  }
}

const calculateMomentumSum = (figureList) => {
  return figureList.reduce((acc, figure) => {
    const momentum = figure.weight * figure.offset
    return acc + momentum
  }, 0)
}

const calculateFigureSwingOffsetBottom = (figureList, fallingFigure) => {
  return figureList
    .filter(figureOnSwing => figureOnSwing.offset === fallingFigure.offset)
    .reduce((bottomRes, figure) => bottomRes + figure.size, 0)
}

const state = {
  isPaused: true,
  intevalId: null,
  fallingFigureList: [],
  leftFigureList: [],
  rightFigureList: [],
  fallTimeout: FALL_TIMEOUT,
  swingCoordinates: {}
}

const getters = {
  isPaused: state => state.isPaused,
  fallingFigureList: state => state.fallingFigureList,
  leftFigureList: state => state.leftFigureList,
  rightFigureList: state => state.rightFigureList,
  momentumLeft: state => calculateMomentumSum(state.leftFigureList),
  momentumRight: state => calculateMomentumSum(state.rightFigureList),
  bending: (state, { momentumLeft, momentumRight }) => {
    if (!momentumLeft) return MAX_BENDING
    if (momentumLeft === momentumRight) return 0
    if (momentumLeft > momentumRight) {
      return (momentumLeft - momentumRight) / momentumLeft * -100
    }
    return (momentumRight - momentumLeft) / momentumRight * 100
  },
  getFigureFinalPositionFromTop: (state, { bending }) => figure => {
    const { top, bottom } = state.swingCoordinates
    const bendingHalfHeight = (bottom - top) / 2
    const offsetСoefficient = 1 - figure.offset / (TEETER_TOTTER_WIDTH / 2)
    const relativeEndDelta = bendingHalfHeight * offsetСoefficient
    if (bending >= 0) {
      return top + relativeEndDelta - figure.offsetBottom
    }
    return bottom - relativeEndDelta - figure.offsetBottom
  },
  isGameOver (state, getters) {
    if (!getters.leftFigureList.length) return false
    const { momentumLeft, momentumRight, bending } = getters
    return Math.abs(bending) > MAX_BENDING || Math.abs(momentumLeft - momentumRight) > MAX_SIDES_DIFFERENCE
  }
}

const mutations = {
  TOGGLE_PAUSE (state) {
    state.isPaused = !state.isPaused
  },
  ADD_RIGHT_FIGURE (state) {
    const fallingFigure = generateFigure()
    const offsetBottom = calculateFigureSwingOffsetBottom(state.rightFigureList, fallingFigure)
    state.rightFigureList.push({
      ...fallingFigure,
      offsetBottom
    })
  },
  ADD_LEFT_FIGURE (state) {
    const fallingFigure = state.fallingFigureList.shift()
    const offsetBottom = calculateFigureSwingOffsetBottom(state.leftFigureList, fallingFigure)
    state.leftFigureList.push({
      ...fallingFigure,
      offsetBottom
    })
  },
  INITIALIZE_FALLING_FIGURES (state) {
    state.fallingFigureList = []
    for (let i = 0; i < FALLING_FIGURES_COUNT; i++) {
      const figure = generateFigure()
      state.fallingFigureList.push(figure)
    }
  },
  ADD_FALLING_FIGURE (state) {
    const figure = generateFigure()
    state.fallingFigureList.push(figure)
  },
  MOVE_RIGHT (state) {
    if (state.isPaused || state.fallingFigureList[0].offset - 1 <= 0) return
    state.fallingFigureList[0].offset -= 1
    state.fallingFigureList[0].offsetBottom = calculateFigureSwingOffsetBottom(state.leftFigureList, state.fallingFigureList[0])
  },
  MOVE_LEFT (state) {
    if (state.isPaused || state.fallingFigureList[0].offset + 1 > 5) return
    state.fallingFigureList[0].offset += 1
    state.fallingFigureList[0].offsetBottom = calculateFigureSwingOffsetBottom(state.leftFigureList, state.fallingFigureList[0])
  },
  MOVE_Y (state) {
    if (state.isPaused) return
    state.fallingFigureList[0].top += FALL_DELTA_PX
  },
  UPDATE_SWING_COORDINATES (state, coordinates) {
    state.swingCoordinates = coordinates
  },
  UPDATE_FIGURE_BOTTOM_COORDINATE (state, bottomCoord) {
    state.fallingFigureList[0].bottomCoord = bottomCoord
  },
  SET_INTERVAL_ID (state, intervalId) {
    state.intervalId = intervalId
  },
  CLEAR_INTERVAL (state) {
    if (!state.intervalId) return
    clearInterval(state.intervalId)
  },
  DECREASE_FALL_TIMEOUT (state) {
    state.fallTimeout -= FALL_TIMEOUT_DECREASING
  },
  RESET (state) {
    state.isPaused = true
    state.leftFigureList = []
    state.rightFigureList = []
    state.fallingFigureList = []
    state.fallTimeout = FALL_TIMEOUT
    state.iterationCount = 0
  }
}

const actions = {
  ON_TOGGLE_PAUSE ({ getters, dispatch, commit }) {
    if (getters.isGameOver) {
      dispatch('START_NEW_GAME')
      return
    }
    commit('TOGGLE_PAUSE')
    const { isPaused } = getters
    if (isPaused) {
      commit('CLEAR_INTERVAL')
    } else {
      dispatch('PROCESS_FALLING')
    }
  },
  PROCESS_FALLING ({ state, getters, commit, dispatch }) {
    const intervalId = setInterval(() => {
      const figure = state.fallingFigureList[0]
      const finalPosition = getters.getFigureFinalPositionFromTop(figure)
      if (figure.bottomCoord >= finalPosition - FALL_DELTA_PX) {
        dispatch('FINISH_FALLING')
        clearInterval(intervalId)
        return
      }
      commit('MOVE_Y')
    }, state.fallTimeout)
    commit('SET_INTERVAL_ID', intervalId)
  },
  FINISH_FALLING ({ commit, getters, dispatch }) {
    commit('ADD_LEFT_FIGURE')
    commit('ADD_FALLING_FIGURE')
    commit('ADD_RIGHT_FIGURE')
    commit('DECREASE_FALL_TIMEOUT')
    if (getters.isGameOver) {
      commit('CLEAR_INTERVAL')
    } else {
      dispatch('PROCESS_FALLING')
    }
  },
  START_NEW_GAME ({ commit }) {
    commit('RESET')
    commit('ADD_RIGHT_FIGURE')
    commit('INITIALIZE_FALLING_FIGURES')
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
})
