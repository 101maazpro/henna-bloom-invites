export function BrandRibbon({ name }: { name: string }) {
  if (!name) return null;
  return (
    <aside className="brand-ribbon" aria-label={`Invitation by ${name}`}>
      <div className="brand-marquee" aria-hidden="true">
        {[0, 1].map((copy) => (
          <span key={copy} className="brand-marquee-copy">
            {[0, 1, 2, 3].map((i) => (
              <span key={i}>{name}</span>
            ))}
          </span>
        ))}
      </div>
    </aside>
  );
}
