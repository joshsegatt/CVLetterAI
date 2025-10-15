// Compatibility re-export:
// If older code imports from src/components/Builder/Builderlayout, this file prevents breakage
// by re-exporting the implementation from src/components/builder/BuilderLayout.
// You can remove this file after migrating all imports to src/components/builder/*.

import BuilderLayout from "../builder/BuilderLayout";
export default BuilderLayout;
