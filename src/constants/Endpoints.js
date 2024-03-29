export const BaseURL = process.env.REACT_APP_BASE_URL || 'https://gateway.marvel.com/v1/public'

export const character = (id) => (
  {
    list: `${BaseURL}/characters`,
    details: `${BaseURL}/characters/${id}`
  }
)

export const defaultRequestParameters = {
  limit: 9,
  offset: 0
}
