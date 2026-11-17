import { ArrowDownRight, ArrowUpRight, Bug, Plus } from "lucide-react";
import { workspaceNotes } from "@/lib/portfolio-content";
import { WorkspacePopover } from "./workspace-popover";
import { WorkspaceInteraction } from "./workspace-interaction";
import { CharacterAnimation } from "./character-animation";
import { workspaceCharacterAssets } from "@/lib/character-assets";

export function WorkspaceScene() {
  return <section id="workspace" className="workspace-section section-space" aria-labelledby="workspace-heading" tabIndex={-1}>
    <div className="site-shell">
      <div className="workspace-intro" data-reveal data-reveal-group><h2 id="workspace-heading">Come into<br /><em>the workshop.</em></h2><div><p>This is where an everyday problem becomes a project. Open the laptop, read a development note, or switch off the desk lamp.</p><span className="workspace-invitation">The objects are yours to explore <ArrowDownRight size={19} aria-hidden="true" /></span></div></div>
      <WorkspaceInteraction>
      <div className="workspace-stage" data-reveal="media">
        {workspaceCharacterAssets && <div className="workspace-character-slot"><CharacterAnimation assets={workspaceCharacterAssets} scene="workspace" /></div>}
        <div className="workspace-wall" aria-hidden="true"><svg viewBox="0 0 1000 440" fill="none" preserveAspectRatio="xMidYMid slice"><path d="M58 370V141a110 110 0 0 1 220 0v229M69 370V141a99 99 0 0 1 198 0v229M58 205h220M167 31v339" /><path d="M817 52h111v134H817zM829 65h87v108h-87z" /><circle cx="872" cy="119" r="30" /><path d="M842 119h60M872 89v60M0 370h1000" /></svg></div>
        <div className="workspace-light" aria-hidden="true" />
        <div className="workspace-desk" aria-hidden="true" />
        <div className="workspace-lamp">
          <input id="desk-light" className="scene-lamp-input" type="checkbox" defaultChecked aria-label="Desk lamp" />
          <label htmlFor="desk-light" className="workspace-object lamp-object"><svg viewBox="0 0 180 250" fill="none" aria-hidden="true"><path className="object-stroke" d="M90 220V131l42-60M90 133 56 95" /><circle className="object-joint" cx="90" cy="132" r="7" /><path className="lamp-shade" d="m100 38 47 15 14 46-82-28z" /><path className="lamp-inner" d="m79 71 82 28-3 9-82-28z" /><path className="lamp-base" d="M52 222h76l9 12H43z" /></svg><span className="object-label"><span className="lamp-label-on">Lamp on</span><span className="lamp-label-off">Lamp off</span><span className="lamp-switch" aria-hidden="true" /></span></label>
        </div>
        <button className="workspace-object laptop-object" type="button" popoverTarget="workspace-laptop" aria-label="Open laptop: what I’m building">
          <span className="laptop-screen"><span className="laptop-camera" /><span className="laptop-screen-content"><span className="laptop-code" aria-hidden="true">&lt; / &gt;</span><span className="laptop-project">SportLynk</span><span className="laptop-status">In development</span></span></span><span className="laptop-base" /><span className="object-label">What I’m building <Plus size={14} aria-hidden="true" /></span>
        </button>
        <button className="workspace-object notebook-object" type="button" popoverTarget="workspace-notebook" aria-label="Open notebook: an engineering thought"><span className="notebook-cover"><span>Notes<br /><em>to build on.</em></span><span className="notebook-rule" /><span className="notebook-spine" /></span><span className="object-label">The notebook <Plus size={14} aria-hidden="true" /></span></button>
        <a href="#sportlynk" className="workspace-object project-object" aria-label="Explore SportLynk project"><span className="project-object-plaque"><span>SL<span className="plaque-dot">.</span></span><ArrowUpRight size={22} aria-hidden="true" /></span><span className="object-label">The next project <ArrowUpRight size={14} aria-hidden="true" /></span></a>
        <button className="workspace-bug" type="button" popoverTarget="workspace-bug-note" aria-label="Inspect the hidden software bug"><Bug size={21} strokeWidth={1.5} aria-hidden="true" /><span className="bug-hint">An edge case?</span></button>
        <div className="workspace-stage-caption"><span>Anees’s workbench</span><span>Ideas welcome. Bugs, less so.</span></div>
        <WorkspacePopover id="workspace-laptop" title={workspaceNotes.laptop.title} href={workspaceNotes.laptop.href} link={workspaceNotes.laptop.link}>{workspaceNotes.laptop.body}</WorkspacePopover>
        <WorkspacePopover id="workspace-notebook" title={workspaceNotes.notebook.title} href={workspaceNotes.notebook.href} link={workspaceNotes.notebook.link}>{workspaceNotes.notebook.body}</WorkspacePopover>
        <WorkspacePopover id="workspace-bug-note" title={workspaceNotes.bug.title} href={workspaceNotes.bug.href} link={workspaceNotes.bug.link}>{workspaceNotes.bug.body}</WorkspacePopover>
      </div>
      </WorkspaceInteraction>
    </div>
  </section>;
}
