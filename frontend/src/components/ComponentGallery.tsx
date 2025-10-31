import React from "react";
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Dropdown,
  Input,
  Modal,
  Nav,
  Progress,
  Tabs,
  Toggle,
  Tooltip,
} from "./index";

import "../styles/neoBrutalist.css";
import "./ComponentGallery.css";

const galleryTabs = [
  { label: "Tab A", content: "Content for Tab A." },
  { label: "Tab B", content: "Content for Tab B." },
  { label: "Tab C", content: "Content for Tab C." },
];

const accordionItems = [
  { title: "Section A", content: "Details for section A." },
  { title: "Section B", content: "Details for section B." },
];

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

const Section = ({ title, children }: SectionProps) => (
  <div className="neo-brutalist neo-gallery__section">
    <header className="neo-gallery__section-header">
      <h2 className="neo-gallery__section-title">{title}</h2>
    </header>
    <div className="neo-gallery__section-body">{children}</div>
  </div>
);

export function ComponentGallery() {
  const [toggleChecked, setToggleChecked] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [dropdownSelection, setDropdownSelection] = React.useState<string | null>(null);
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const [showAlert, setShowAlert] = React.useState(true);

  return (
    <>
      <div className="neo-gallery__background neo-page-backdrop" aria-hidden="true" />
      <div className="neo-gallery">
        <div className="neo-gallery__inner">
          <div className="neo-gallery__grid">
          <Section title="Button">
            <Button variant="yellow">Neo Button</Button>
          </Section>

          <Section title="Card">
            <Card title="Sample Card" content="A raw, functional Neo Brutalist card." />
          </Section>

          <Section title="Input">
            <Input placeholder="Type here..." />
          </Section>

          <Section title="Toggle">
            <Toggle
              label={toggleChecked ? "Enabled" : "Disabled"}
              checked={toggleChecked}
              onChange={(next) => setToggleChecked(next)}
            />
          </Section>

          <Section title="Alert">
            {showAlert ? (
              <Alert tone="success" onDismiss={() => setShowAlert(false)}>
                Success Alert!
              </Alert>
            ) : (
              <Badge variant="green" text="Dismissed" />
            )}
          </Section>

          <Section title="Modal">
            <div className="neo-gallery__stack">
              <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Neo Modal">
                A stark, no-nonsense modal window.
              </Modal>
            </div>
          </Section>

          <Section title="Navigation">
            <Nav
              links={[
                { label: "Home", href: "#" },
                { label: "Services", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Contact", href: "#" },
              ]}
            />
          </Section>

          <Section title="Progress">
            <Progress value={75} showLabel />
          </Section>

          <Section title="Dropdown">
            <div className="neo-gallery__stack">
              <Dropdown
                label={dropdownSelection ?? "Menu"}
                options={[
                  { label: "Item 1", value: "Item 1" },
                  { label: "Item 2", value: "Item 2" },
                  { label: "Item 3", value: "Item 3" },
                ]}
                onSelect={(value) => setDropdownSelection(value)}
              />
              {dropdownSelection && (
                <span className="neo-gallery__helper-text">Selected: {dropdownSelection}</span>
              )}
            </div>
          </Section>

          <Section title="Accordion">
            <Accordion items={accordionItems} />
          </Section>

          <Section title="Tooltip">
            <Tooltip trigger="Info" content="This is a brutalist tooltip!" />
          </Section>

          <Section title="Avatar">
            <Avatar initials="AB" bgClassName="neo-avatar--bg-yellow" textClassName="neo-avatar--text-black" />
          </Section>

          <Section title="Badge">
            <Badge text="Hot" variant="red" textColor="white" />
          </Section>

          <Section title="Tabs">
            <Tabs
              tabs={galleryTabs}
              initialTab={activeTabIndex}
              onChange={(_, index) => setActiveTabIndex(index)}
            />
          </Section>
          </div>
        </div>
      </div>
    </>
  );
}
