export const encodeToBase64 = (byteData: ArrayBuffer): string => {
  // Convert the byte array to a Uint8Array
  const uintArray = new Uint8Array(byteData)
  // Convert the Uint8Array to a string
  const stringChar = uintArray.reduce(
    (data, byte) => data + String.fromCharCode(byte),
    ""
  )
  return btoa(stringChar)
}

export const decodeBase64ToImage = (base64String: string): string => {
  // Decode the Base64 string to bytes
  const byteString = atob(base64String)
  // Convert the bytes to a blob
  const byteNumbers = new Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    byteNumbers[i] = byteString.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: "image/*" })
  const imageUrl = URL.createObjectURL(blob)
  return imageUrl
}
