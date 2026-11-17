export type BookingMode = "unprotected" | "protected";
export type LabState = { mode: BookingMode; step: number; observed: [boolean | null, boolean | null]; reservations: string[]; events: { actor: string; action: string }[] };
export const createLab = (mode: BookingMode): LabState => ({ mode, step: 0, observed: [null, null], reservations: [], events: [] });
export function advanceLab(state: LabState): LabState {
  if (state.step >= 4) return state;
  const next: LabState = { ...state, step: state.step + 1, observed: [...state.observed], reservations: [...state.reservations], events: [...state.events] };
  const player = state.step % 2;
  const actor = player === 0 ? "Player A" : "Player B";
  if (state.step < 2) {
    next.observed[player] = state.reservations.length === 0;
    next.events.push({ actor, action: "Reads the slot: available." });
  } else if (state.mode === "unprotected") {
    if (state.observed[player]) next.reservations.push(actor);
    next.events.push({ actor, action: "Accepts the booking using the earlier availability check." });
  } else {
    const free = state.reservations.length === 0;
    if (free) next.reservations.push(actor);
    next.events.push({ actor, action: free ? "Checks and reserves in one protected operation. Accepted." : "Checks at the reservation boundary. Slot is taken. Rejected." });
  }
  return next;
}
