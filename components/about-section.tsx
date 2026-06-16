/* eslint-disable @next/next/no-img-element */
import siteConfig from "@/config";
import { ChevronRight } from "@mui/icons-material";
import Facebook from "@mui/icons-material/Facebook";
import Instagram from "@mui/icons-material/Instagram";
import { Container, IconButton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { getInTouchOptions } from "./get-in-touch-form";

const AboutSection = () => {
  if (!siteConfig.aboutSection) return null;

  return (
    <div id="about-section">
      <Container maxWidth="lg" className="about-section-container">
        <Image
          width={500}
          height={333}
          src={siteConfig.aboutSection.image}
          alt={siteConfig.aboutSection.title}
        />
        <div className="content">
          <div className="main">
            <h2>{siteConfig.aboutSection.title}</h2>
            <p>{siteConfig.aboutSection.description}</p>
          </div>
          <div className="actions">
            <div className="social">
              {siteConfig.facebook && (
                <IconButton
                  color="secondary"
                  onClick={() => getInTouchOptions.openFacebook()}
                >
                  <Facebook />
                </IconButton>
              )}
              {siteConfig.instagram && (
                <IconButton
                  color="secondary"
                  onClick={() => getInTouchOptions.openInstagram()}
                >
                  <Instagram />
                </IconButton>
              )}
            </div>
            <Link className="read-more" href="/sobre">
              Leia a história completa <ChevronRight />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AboutSection;
