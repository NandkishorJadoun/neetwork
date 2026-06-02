import { Link } from "@tanstack/react-router"
import type { User } from "../types"

type CommentCardProp = {
  text: string,
  author: User,
}

export const CommentCard = ({ text, author }: CommentCardProp) => {
  return (
    <div>
      <Link to='/users/$userId' params={{ userId: author.id }}>
        <img src={author.avatar} alt={`${author.username}'s avatar`} width={25} />
      </Link>
      <div>
        <Link to='/users/$userId' params={{ userId: author.id }}>
          <p>{author.fullname}</p>
          <span>{author.username}</span>
        </Link>
        <div>{text}</div>
      </div>
    </div>
  )
}