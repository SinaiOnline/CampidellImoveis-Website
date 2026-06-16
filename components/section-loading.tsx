import { CircularProgress } from "@mui/material";

const SectionLoading = () => {
  return (
    <div className="section-loading">
      <CircularProgress />
      <p>Carregando...</p>
    </div>
  );
};

export default SectionLoading;
