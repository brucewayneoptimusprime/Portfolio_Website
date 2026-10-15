import { BioStrip } from "@/components/sections/BioStrip";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { Recognition } from "@/components/sections/Recognition";
import { Skills } from "@/components/sections/Skills";
import { Footer } from "@/components/ui/Footer";
import { Nav } from "@/components/ui/Nav";
import { Section } from "@/components/ui/SectionHeader";
import {
  getAbout,
  getClubs,
  getExperience,
  getProjects,
  getRecognition,
  getResumeHref,
  getSite,
  getSkills,
} from "@/lib/content";

export default function Home() {
  const about = getAbout();
  const site = getSite();
  const s = site.sections;

  const { all, featured } = getProjects();

  // Page order sets the roman numerals.
  const sections: { id: string; label: string; title: string; content: React.ReactNode }[] = [
    {
      id: "experience",
      ...s.experience,
      content: (
        <Experience
          roles={getExperience()}
          clubs={getClubs()}
          clubsHeading={site.experience.clubs}
          logoLabels={{ view: site.a11y.viewLogo, close: site.a11y.closeLogo }}
        />
      ),
    },
    {
      id: "featured",
      ...s.featured,
      content: (
        <FeaturedProjects
          projects={featured}
          labels={{ project: site.project, links: site.links, buttons: site.buttons }}
        />
      ),
    },
    {
      id: "projects",
      ...s.allProjects,
      content: (
        <ProjectGrid projects={all} labels={{ filter: site.filter, links: site.links, buttons: site.buttons }} />
      ),
    },
    { id: "skills", ...s.skills, content: <Skills skills={getSkills()} depthNote={site.skills.depthNote} /> },
    {
      id: "recognition",
      ...s.recognition,
      content: (
        <Recognition
          recognition={getRecognition()}
          allCertifications={
            about.links.linkedin ? { href: about.links.linkedin, label: site.recognition.allCertifications } : undefined
          }
        />
      ),
    },
    {
      id: "contact",
      ...s.contact,
      content: <Contact about={about} labels={{ buttons: site.buttons, links: site.links, contact: site.contact }} />,
    },
  ];

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-card bg-accent-fill px-4 py-3 font-medium text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {site.a11y.skipToContent}
      </a>

      <Nav
        name={about.name}
        items={site.nav}
        linkedin={about.links.linkedin ? { href: about.links.linkedin, label: site.links.linkedin } : undefined}
        github={about.links.github ? { href: about.links.github, label: site.links.github } : undefined}
        labels={site.a11y}
      />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero
          name={about.name}
          title={about.title}
          pitch={about.pitch}
          labels={site.buttons}
          resumeHref={getResumeHref()}
        />
        <BioStrip bio={about.bio} stats={about.stats} />

        {sections.map((section, i) => (
          <Section key={section.id} id={section.id} index={i + 1} label={section.label} title={section.title}>
            {section.content}
          </Section>
        ))}
      </main>

      <Footer name={about.name} />
    </>
  );
}
