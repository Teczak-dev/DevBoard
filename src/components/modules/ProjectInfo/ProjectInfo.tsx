import type { Project } from "../../../shared/types/project";

const ProjectInfo = ({ item }: { item: Project }) => {
  return (
    <>
      <h1 style={{ marginBottom: "5px", maxWidth: "50%", textWrap: "wrap" }}>
        {item.title}
      </h1>
      <p style={{ marginTop: "5px" }}>Project id: {item.id}</p>
      <p
        style={{
          maxWidth: "300px",
          maxHeight: "300px",
          textWrap: "wrap",
          textAlign: "center",
        }}
      >
        Description:
        <br />{" "}
        {item.description?.length || "".length > 0
          ? item.description
          : "No description provided"}
      </p>
    </>
  );
};
export default ProjectInfo;
