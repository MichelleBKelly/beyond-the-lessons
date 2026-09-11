export function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return <article className="step"><span className="step-number">{number}</span><h3>{title}</h3><p>{text}</p></article>
}
