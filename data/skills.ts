import type { SkillCategory } from "@/types";

export const skills: SkillCategory[] = [
  {
    category: "Languages",
    skills: [
      { name: "Python", proficiency: "core" },
      { name: "C++", proficiency: "core" },
      { name: "JavaScript", proficiency: "core" },
      { name: "TypeScript", proficiency: "proficient" },
      { name: "R", proficiency: "proficient" },
      { name: "Java", proficiency: "proficient" },
      { name: "SQL", proficiency: "proficient" },
      { name: "MATLAB", proficiency: "familiar" },
      { name: "Julia", proficiency: "familiar" },
    ],
  },
  {
    category: "ML & AI",
    skills: [
      { name: "TensorFlow", proficiency: "core" },
      { name: "PyTorch", proficiency: "core" },
      { name: "CUDA", proficiency: "proficient" },
      { name: "Triton", proficiency: "proficient" },
      { name: "TensorRT", proficiency: "proficient" },
      { name: "ONNX", proficiency: "proficient" },
      { name: "OpenCV", proficiency: "proficient" },
      { name: "NCCL", proficiency: "familiar" },
    ],
  },
  {
    category: "Bioinformatics",
    skills: [
      { name: "AlphaFold", proficiency: "core" },
      { name: "GROMACS", proficiency: "proficient" },
      { name: "PDB", proficiency: "proficient" },
      { name: "Pandas", proficiency: "core" },
    ],
  },
  {
    category: "Cloud & Infra",
    skills: [
      { name: "AWS", proficiency: "core" },
      { name: "Microsoft Azure", proficiency: "proficient" },
      { name: "Docker", proficiency: "proficient" },
      { name: "Git", proficiency: "core" },
      { name: "Jupyter", proficiency: "core" },
      { name: "TCP/IP", proficiency: "proficient" },
    ],
  },
  {
    category: "Web & Backend",
    skills: [
      { name: "React.js", proficiency: "core" },
      { name: "Node.js", proficiency: "proficient" },
      { name: "FastAPI", proficiency: "proficient" },
      { name: "SpringBoot", proficiency: "familiar" },
      { name: "MCP", proficiency: "familiar" },
    ],
  },
];
