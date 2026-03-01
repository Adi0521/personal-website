// All Spline scene URLs, object names, and event names in one place.
// Never hard-code these strings in component files.

export const SPLINE_SCENES = {
  HERO_NEURAL:  "https://prod.spline.design/placeholder-hero/scene.splinecode",
  MINI_CAR:     "https://prod.spline.design/placeholder-car/scene.splinecode",
  PROTEIN:      "https://prod.spline.design/placeholder-protein/scene.splinecode",
  NEURON_SPIKE: "https://prod.spline.design/placeholder-neuron/scene.splinecode",
  SERVER:       "https://prod.spline.design/placeholder-server/scene.splinecode",
} as const;

export const SPLINE_OBJECTS = {
  CAR_BODY:       "CarBody",
  PROTEIN_STRAND: "ProteinStrand",
  NEURON_CELL:    "NeuronCell",
  SERVER_RACK:    "ServerRack",
  NEURAL_NET:     "NeuralNet",
} as const;

export const SPLINE_EVENTS = {
  MOUSE_HOVER: "mouseHover",
  MOUSE_LEAVE: "mouseLeave",
  SCROLL_IN:   "scrollIn",
  SCROLL_OUT:  "scrollOut",
} as const;

export type SplineSceneKey = keyof typeof SPLINE_SCENES;
export type SplineObjectKey = keyof typeof SPLINE_OBJECTS;
