/* eslint-disable @next/next/no-img-element */

interface BootstrapIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  icon: string
  white?: boolean
}

export const BootstrapIcon: React.FC<BootstrapIconProps> = ({ icon, white, ...props }) => {
  return (
    <img
      {...props}
      alt={icon}
      src={`https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/${icon}.svg`}
    />
  )
}

export default BootstrapIcon