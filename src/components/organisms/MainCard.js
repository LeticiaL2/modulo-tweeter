import TweetHeader from '../molecules/TweetHeader';
import TweetFooter from './TweetFooter';

function MainCard({
  tweetData,
  handleMainTweetComment,
  handleMainTweetRetweet,
  handleMainTweetLike,
}) {
  return (
    <div className="main-card">
      <TweetHeader
        user={{ nome: tweetData.nome, usuario: tweetData.usuario }}
      />
      <div className="main-card--content">{tweetData.texto}</div>
      <div className="main-card--date">{tweetData.data}</div>
      <TweetFooter
        comments={tweetData.comentarios}
        retweets={tweetData.retweets}
        likes={tweetData.likes}
        handleMainTweetComment={handleMainTweetComment}
        handleMainTweetRetweet={handleMainTweetRetweet}
        handleMainTweetLike={handleMainTweetLike}
      />
    </div>
  );
}

export default MainCard;
