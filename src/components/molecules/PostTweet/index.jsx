import React from 'react';
import {
  Container,
  FormTweet,
  InputTweetContainer,
  ActionsContainer,
} from './styles';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import UserPhoto from '../../atoms/UserPhoto';

function PostTweet({ onAddTweet }) {
  const [enteredTweet, setEnteredTweet] = React.useState('');
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);

  const handleTweetChange = (e) => {
    setEnteredTweet(e.target.value);
    setIsButtonDisabled(e.target.value === '');
  };

  const handlePostTweetData = (e) => {
    e.preventDefault();
    if (enteredTweet === '') return;

    const tweetData = {
      id: Math.floor(Math.random() * 1000) + 3,
      name: 'User',
      username: '@user',
      content: enteredTweet,
      userphoto:
        'data:image/png;base64,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',
      date: '1h',
      actions: {
        comments: 0,
        retweets: 0,
        likes: 0,
        views: 0,
      },
    };
    onAddTweet(tweetData);
    setEnteredTweet('');
    setIsButtonDisabled(true);
  };

  return (
    <Container>
      <UserPhoto src="data:image/png;base64,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" />
      <FormTweet onSubmit={handlePostTweetData}>
        <InputTweetContainer>
          <Input
            type="text"
            placeholder="What's hapenning?!"
            value={enteredTweet}
            onChange={handleTweetChange}
          />
        </InputTweetContainer>
        <ActionsContainer>
          <Button  disabled={isButtonDisabled}>
            Post
          </Button>
        </ActionsContainer>
      </FormTweet>
    </Container>
  );
}

export default PostTweet;
