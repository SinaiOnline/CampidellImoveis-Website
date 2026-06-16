import { Container } from "@mui/material";
import React from "react";

const PoliticaDePrivacidade: React.FC = () => {
  const [origin, setOrigin] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  return (
    <div className="politica-privacidade-page">
      <Container maxWidth="lg" className="politica-privacidade-page-container">
        <h1>Politica de Privacidade</h1>
        <h5>QUEM SOMOS</h5>
        <p>
          O endereço do nosso site é:{" "}
          <a href={origin} target="_blank">
            {origin}
          </a>
        </p>

        <section>
          <h5>QUAIS DADOS PESSOAIS COLETAMOS E PORQUE</h5>

          <h6>Comentários</h6>
          <p>
            Quando os visitantes deixam comentários no site, coletamos os dados
            mostrados no formulário de comentários, além do endereço de IP e de
            dados do navegador do visitante, para auxiliar na detecção de spam.
          </p>
          <p>
            Uma sequência anonimizada de caracteres criada a partir do seu
            e-mail (também chamada de hash) poderá ser enviada para o Gravatar
            para verificar se você usa o serviço. A política de privacidade do
            Gravatar está disponível aqui:
            <a href="https://automattic.com/privacy/" target="_blank">
              https://automattic.com/privacy/
            </a>
            . Depois da aprovação do seu comentário, a foto do seu perfil fica
            visível publicamente junto de seu comentário.
          </p>

          <h6>Mídia</h6>
          <p>
            Se você envia imagens para o site, evite enviar as que contenham
            dados de localização incorporados (EXIF GPS). Visitantes podem
            baixar estas imagens do site e extrair delas seus dados de
            localização.
          </p>

          <h6>Formulários de contato</h6>

          <h6>Cookies</h6>
          <p>
            Ao deixar um comentário no site, você poderá optar por salvar seu
            nome, e-mail e site nos cookies. Isso visa seu conforto, assim você
            não precisará preencher seus dados novamente quando fizer outro
            comentário. Estes cookies duram um ano.
          </p>
          <p>
            Se você tem uma conta e acessa este site, um cookie temporário será
            criado para determinar se seu navegador aceita cookies. Ele não
            contém nenhum dado pessoal e será descartado quando você fechar seu
            navegador.
          </p>
          <p>
            Quando você acessa sua conta no site, também criamos vários cookies
            para salvar os dados da sua conta e suas escolhas de exibição de
            tela. Cookies de login são mantidos por dois dias e cookies de
            opções de tela por um ano. Se você selecionar “Lembrar-me”, seu
            acesso será mantido por duas semanas. Se você se desconectar da sua
            conta, os cookies de login serão removidos.
          </p>
          <p>
            Se você editar ou publicar um artigo, um cookie adicional será salvo
            no seu navegador. Este cookie não inclui nenhum dado pessoal e
            simplesmente indica o ID do post referente ao artigo que você acabou
            de editar. Ele expira depois de 1 dia.
          </p>

          <h6>Mídia incorporada de outros sites</h6>
          <p>
            Artigos neste site podem incluir conteúdo incorporado como, por
            exemplo, vídeos, imagens, artigos, etc. Conteúdos incorporados de
            outros sites se comportam exatamente da mesma forma como se o
            visitante estivesse visitando o outro site.
          </p>
          <p>
            Estes sites podem coletar dados sobre você, usar cookies, incorporar
            rastreamento adicional de terceiros e monitorar sua interação com
            este conteúdo incorporado, incluindo sua interação com o conteúdo
            incorporado se você tem uma conta e está conectado com o site.
          </p>
        </section>
        <h6>Análises</h6>

        <section>
          <h5>COM QUEM PARTILHAMOS SEUS DADOS</h5>
        </section>

        <section>
          <h5>POR QUANTO TEMPO MANTEMOS OS SEUS DADOS</h5>
          <p>
            Se você deixar um comentário, o comentário e os seus metadados são
            conservados indefinidamente. Fazemos isso para que seja possível
            reconhecer e aprovar automaticamente qualquer comentário posterior
            ao invés de retê-lo para moderação.
          </p>
          <p>
            Para usuários que se registram no nosso site (se houver), também
            guardamos as informações pessoais que fornecem no seu perfil de
            usuário. Todos os usuários podem ver, editar ou excluir suas
            informações pessoais a qualquer momento (só não é possível alterar o
            seu username). Os administradores de sites também podem ver e editar
            estas informações.
          </p>
        </section>

        <section>
          <h5>QUAIS OS SEUS DIREITOS SOBRE SEUS DADOS</h5>
          <p>
            Se você tiver uma conta neste site ou se tiver deixado comentários,
            pode solicitar um arquivo exportado dos dados pessoais que mantemos
            sobre você, inclusive quaisquer dados que nos tenha fornecido.
            Também pode solicitar que removamos qualquer dado pessoal que
            mantemos sobre você. Isto não inclui nenhuns dados que somos
            obrigados a manter para propósitos administrativos, legais ou de
            segurança.
          </p>
        </section>

        <section>
          <h5>PARA ONDE ENVIAMOS SEUS DADOS</h5>
          <p>
            Comentários de visitantes podem ser marcados por um serviço
            automático de detecção de spam.
          </p>
        </section>

        <section>
          <h5>SUAS INFORMAÇÕES DE CONTATO</h5>
        </section>

        <section>
          <h5>INFORMAÇÕES ADICIONAIS</h5>

          <p>Como protegemos seus dados</p>

          <p>Quais são nossos procedimentos contra violação de dados</p>

          <p>De quais terceiros nós recebemos dados</p>

          <p>
            Quais tomadas de decisão ou análises de perfil automatizadas fazemos
            com os dados de usuários
          </p>

          <p>
            Requisitos obrigatórios de divulgação para sua categoria
            profissional
          </p>
        </section>
      </Container>
    </div>
  );
};

export default PoliticaDePrivacidade;
