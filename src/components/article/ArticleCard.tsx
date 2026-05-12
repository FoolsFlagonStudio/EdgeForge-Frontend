import { useNavigate } from "react-router-dom";
import type { ArticleListItem } from "../../types/articles";

interface Props {
  article: ArticleListItem;
}

function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
}

export default function ArticleCard({ article }: Props) {
  const navigate = useNavigate();
  const preview = stripHtml(article.body).slice(0, 200);
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Draft";

  return (
    <div className="article-card" onClick={() => navigate(`/articles/${article.id}`)}>
      <div className="article-card-title">{article.title}</div>
      {article.subtitle && (
        <div className="article-card-subtitle">{article.subtitle}</div>
      )}
      <div className="article-card-meta">
        <span
          className="player-link"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/users/${article.author.id}`);
          }}
        >
          {article.author.display_name ?? "Unknown"}
        </span>
        <span>{date}</span>
        {article.sport && <span>{article.sport.toUpperCase()}</span>}
      </div>
      {preview && <div className="article-card-preview">{preview}</div>}
    </div>
  );
}
