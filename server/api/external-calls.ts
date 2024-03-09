import fetch from 'node-fetch'

export const getOwnerName = async (ownerId: string) => {
  const url = `https://api.sleeper.app/v1/user/${ownerId}`
  const response = await fetch(url)
  const data = await response.json() as any

  return data.display_name as string
}