import type { ProjectItem } from "@/types";

export const projects: ProjectItem[] = [
  {
    id: "self-driving-minicar",
    title: "Self-Driving MiniCar",
    shortDescription:
      "Autonomous RC car using LiDAR point clouds and a CNN perception stack to navigate a 400m track.",
    fullDescription: [
      "Built a fully autonomous RC car capable of navigating indoor track environments without human input, integrating real-time sensor fusion with a deep learning perception stack.",
      "Preprocessed data from LiDAR and camera frames, then used a CNN for obstacle detection and route correction — improving lap times around the 400m route by ~4.5 seconds through model compression and algorithmic optimization.",
      "Simulated and validated performance with MATLAB Simulink, modeling obstacle and vehicle dynamics prior to deploying on embedded hardware.",
    ],
    techTags: ["Python", "C++", "LiDAR", "CNN", "PyTorch", "MATLAB Simulink", "Embedded Systems"],
    splineScene: "MINI_CAR",
    splineHoverObject: "CarBody",
    githubUrl: "https://github.com/Adi0521",
    coverGradient: "from-sunset-orange to-sunset-pink",
  },
  {
    id: "protein-modeling-rubisco",
    title: "Protein Modeling: RuBisCO",
    shortDescription:
      "Structural prediction and molecular dynamics simulation of RuBisCO using AlphaFold and GROMACS.",
    fullDescription: [
      "Reviewed research on promoting RuBisCO activity to improve crop yields and enhance carbon sequestration — one of the most impactful targets in climate-focused bioengineering.",
      "Used PDB, AlphaFold, and GROMACS to model protein folding and interactions resulting from potential structural modifications to the enzyme's active site.",
      "Analyzed simulation trajectories to identify key allosteric sites and predict how targeted mutations might alter catalytic efficiency.",
    ],
    techTags: ["AlphaFold", "GROMACS", "PDB", "Python", "Bioinformatics", "Molecular Dynamics"],
    splineScene: "PROTEIN",
    splineHoverObject: "ProteinStrand",
    githubUrl: "https://github.com/Adi0521",
    coverGradient: "from-deep-blue-light to-sunset-pink",
  },
];
