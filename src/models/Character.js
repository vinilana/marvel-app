// Services
import { character as characterService } from '../services'

const initialState = {
  actual: null,
  list: [],
  customCharacters: []
}

export const character = {
  state: initialState,
  reducers: {
    setActualCharacter (state, payload) {
      return { ...state, actual: payload }
    },
    setList (state, payload) {
      return { ...state, list: payload }
    },
    setCustomCharacter (state, payload) {
      return { ...state, customCharacters: [...state.customCharacters, payload] }
    }
  },
  effects: (dispatch) => ({
    async find ({ nameStartsWith }, rootState) {
      let parameters = {}

      if (nameStartsWith) {
        parameters = {
          ...parameters,
          nameStartsWith
        }
      }

      characterService.list(parameters)
        .then(({ data }) => {
          const results = data.data.results

          // Replace if any character has already been edited on client side
          const customCharacters = rootState.character.customCharacters
          const customResults = results.reduce((result, character) => {
            if (nameStartsWith) {
              const customCharactersResult = customCharacters.filter(character => character.name.includes(nameStartsWith))
              const customCharacter = customCharactersResult.find(custom => (custom.id === character.id))

              if (customCharacter) {
                result.push(customCharacter)
              } else {
                result.push(character)
              }
            } else {
              const customCharacter = customCharacters.find(custom => (custom.id === character.id))

              if (customCharacter) {
                result.push(customCharacter)
              } else {
                result.push(character)
              }
            }

            return result
          }, [])

          this.setList(customResults)
        })
        .catch(e => console.error(e))
    },
    async findById ({ id }, rootState) {
      const customCharacters = rootState.character.customCharacters
      const customCharacter = customCharacters.find(character => character.id === id)

      // Check if character has been edited on client side
      if (customCharacter) {
        this.setActualCharacter(customCharacter)
      } else {
        characterService.get(id)
          .then(({ data }) => {
            const results = data.data.results
            this.setActualCharacter(results[0])
          })
          .catch(e => console.error(e))
      }
    },
    async update (payload, rootState) {
      const updatedCharacter = payload
      const customCharacters = rootState.character.customCharacters
      const hasBeenUpdatedBefore = (customCharacters.filter(character => character.id === payload.id).length > 0)

      if (hasBeenUpdatedBefore) {
        customCharacters.filter((character, key) => {
          if (character.id === updatedCharacter.id) {
            customCharacters.splice(key, 1)
          }
        })
      }

      this.setCustomCharacter(updatedCharacter)
    }
  })
}
