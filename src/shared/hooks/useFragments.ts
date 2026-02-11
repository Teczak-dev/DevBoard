/**
 * useFragments - Custom hook for accessing fragments context
 * 
 * Provides type-safe access to the fragments context with proper error handling.
 * Must be used within a FragmentsProvider component.
 * 
 * @returns FragmentsContextType - The complete fragments context API
 * @throws Error if used outside of FragmentsProvider
 */

import { useContext } from "react";
import { FragmentsContext, type FragmentsContextType } from "../../context/FragmentsContext";

export const useFragments = (): FragmentsContextType => {
  const context = useContext(FragmentsContext);
  
  if (context === undefined) {
    throw new Error("useFragments must be used within a FragmentsProvider");
  }
  
  return context;
};