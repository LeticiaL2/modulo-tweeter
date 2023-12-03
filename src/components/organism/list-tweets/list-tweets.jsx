// ListTweets.jsx
import React from "react";
import TweetCard from "../../organism/tweet-card/tweet-card";
import { Container } from "./styles";

const ListTweets = ({ tweets, fetchTweets }) => {
  const reversedTweets = [...tweets].reverse();

  return (
    <>
      {reversedTweets.map((tweet, index) => (
        <Container key={index}>
          <TweetCard
            id={tweet.id}
            nome={tweet.nome}
            usuario={tweet.usuario}
            texto={tweet.texto}
            comentarios={tweet.comentarios}
            retweets={tweet.retweets}
            likes={tweet.likes}
            date={tweet.data}
            tweetPai={tweet.tweetPai}
            liked={tweet.liked}
            comentariosArray={tweet.comentariosArray}
          />
        </Container>
      ))}
    </>
  );
};

export default ListTweets;
