export const top50 = async (position) => {
  const res = await fetch(`http://localhost:3001/${position}`)
  const data = await res.json();
  return data
}
