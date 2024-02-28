import CommentFooter from '../../molecules/CommentFooter/CommentFooter';
import CommentHeader from '../../molecules/CommentHeader/CommentHeader';
import Image from '../../atoms/Image/Image';
import styles from './style.module.scss';
import { useState } from 'react';
import MoreModal from '../../molecules/MoreModal/MoreModal';

function CommentCard({ comment, setRefreshCheck }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMore = (event) => {
    if (event) event.preventDefault();
    setIsModalOpen(!isModalOpen);
  };

  return (
    <a href={`/feed/${comment.id}`} className={styles['comment-card--link']}>
      <div className={styles['comment-card']}>
        <div className={styles['comment-card--left']}>
          <Image src="/user.png" variant="comment-user-image" />
        </div>
        <div className={styles['comment-card--right']}>
          <CommentHeader
            name={comment.nome}
            handle={comment.usuario}
            date={comment.data}
            handleMore={handleMore}
          />
          <div className={styles['comment-card--content']}>{comment.texto}</div>
          <CommentFooter
            comments={comment.comentarios}
            retweets={comment.retweets}
            likes={comment.likes}
            liked={comment.liked}
          />
          {isModalOpen && (
            <MoreModal
              closeModal={handleMore}
              commentId={comment.id}
              setRefreshCheck={setRefreshCheck}
            />
          )}
        </div>
      </div>
    </a>
  );
}

export default CommentCard;