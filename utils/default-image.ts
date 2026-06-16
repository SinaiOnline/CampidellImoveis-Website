export default function ImagePlaceholder(width: number, height: number, text?: string) {
  const url = `https://placehold.co/${width}x${height}`

  return text ? `${url}?text=${text}` : url
}

export const NoImagePlaceholder = "/sem-imagem.jpg"
export const NoImagePlaceholderClassName = "no-image-placeholder"

export function IsNoImagePlaceholder(src: string | null | undefined): boolean {
  return !src || src.trim() === "" || src === NoImagePlaceholder
}

export function ImageOrNoImagePlaceholder(src: string | null | undefined): string {
  return IsNoImagePlaceholder(src) ?
    NoImagePlaceholder : // retorna o placeholder se src for inválido
    src || // retorna o src original se válido
    NoImagePlaceholder // retorna o placeholder se src for nulo ou indefinido
}

export function HandlePhotoError(event: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = event.currentTarget
  target.classList.add(NoImagePlaceholderClassName)
  target.src = NoImagePlaceholder
  target.onerror = null
  return true
}

export function HandlePhotoLoaded(event: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = event.currentTarget
  target.classList.add("image-loaded")
}