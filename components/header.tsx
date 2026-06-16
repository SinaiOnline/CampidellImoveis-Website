/* eslint-disable @next/next/no-img-element */
import Container from "@mui/material/Container";

import siteConfig from "@/config";
import Search from "./search";

const Header = () => {
  const backgroundVideo = siteConfig.header.backgroundVideo;
  const backgroundImage = siteConfig.header.backgroundImage;

  const hasBackgroundVideo = backgroundVideo ? true : false;

  return (
    <div className="header">
      {hasBackgroundVideo ? (
        <video
          className="background"
          preload="none"
          autoPlay
          playsInline
          muted
          loop
        >
          {backgroundVideo &&
            <source src={backgroundVideo} type={"video/"+backgroundVideo.split('.').pop()} />
          }
          Seu navegador não suporta vídeos HTML5.
        </video>
      ) : (
        <img
          loading="lazy"
          alt="background"
          className="background"
          src={backgroundImage}
        />
      )}
      <div className="overlay">
        <Container className="hero">
          <div className="title-container">
            {siteConfig.header.title && (
              <h1>
                <span className="title">{siteConfig.header.title}</span>
                <span className="subtitle">{siteConfig.header.subtitle}</span>
              </h1>
            )}
          </div>
          <Search />
        </Container>
      </div>
    </div>
  );
};

export default Header;
