import { footerLinksStyles as s } from './FooterLinks.styles';

interface Props {
  onEditSleep:    () => void;
  onHowItWorks:  () => void;
}

export default function FooterLinks({ onEditSleep, onHowItWorks }: Props) {
  return (
    <div style={s.container}>
      <button onClick={onEditSleep} style={s.editBtn}>
        Edit sleep
      </button>
      <button onClick={onHowItWorks} style={s.howLink}>
        How does the recovery score work?
      </button>
    </div>
  );
}
