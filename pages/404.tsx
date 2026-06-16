import Link from "next/link"

const Loading = ({ isLoading, alternativeMessage, children, className, style }: { isLoading: boolean, alternativeMessage?: string, children?: React.ReactNode, className?: string, style?: React.CSSProperties }) => {
  return (
    <>
      <div style={style} className={`loading-page${className? className: ''}`}>
        <h4>{
          isLoading ? 
            "Carregando..." 
            :
            alternativeMessage ?
            alternativeMessage
            :
            "Página não encontrada"
          }
        </h4>
        {
          !isLoading &&
          <Link href="/">Voltar a página inicial</Link> 
        }
      </div>
    </>
  )
}

export default Loading
