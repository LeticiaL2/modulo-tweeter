import { createContext, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "../services/api";
import { getUserLocalStorage } from "./util";


export const TweetDetailContext = createContext();

const TweetDetailProvider = ({ children }) => {
  const { id } = useParams()
  const [tweet, setTweet] = useState(null)
  const [postUser, setPostUser] = useState(null)
  const [commentsList, setCommentsList] = useState([])
  const [openCommentModalId, setOpenCommentModalId] = useState(null)

  const fetchTweet = useCallback(async () => {
    try {
      const response = await Api.get(`/api/v1/tweets/${id}`, { headers: { Authorization: `Bearer ${getUserLocalStorage().token}` } })
      if (response.status !== 200) {
        throw new Error('Erro ao buscar o tweet')
      }
      setPostUser(response.data.conteudo.usuario)
      setTweet(response.data.conteudo)
      setCommentsList(response.data.conteudo.comentariosArray)
    } catch (error) {
      console.log(error)
    }
  }, [id])

  const handleAddComment = async (reply, id) => {
    try {
      const response = await Api.post(`api/v1/tweets/${id}/comentarios`, reply, { headers: { Authorization: `Bearer ${getUserLocalStorage().token}` } })

      if (response.status !== 201) {
        throw new Error(response.data.message || 'Something went wrong')
      }
      setOpenCommentModalId(null)
      fetchTweet()
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchTweet()
  }, [id, fetchTweet])

  const updateTweets = (updatedTweet) => {
    const updatedList = commentsList.map(
      tweet => {
        if (tweet.retweetPai?.id === updatedTweet.id) {
          return { ...tweet, retweetPai: updatedTweet }
        }
        if (tweet.id === updatedTweet.id) {
          return { ...tweet, isLikedByUser: updatedTweet.isLikedByUser, likes: updatedTweet.likes, comentarios: updatedTweet.comentarios }
        }
        return tweet
      })

    setCommentsList(updatedList)
  }

  const handleAddRetweetWithQuote = async (retweet, id) => {
    try {
      const response = await Api.post(`api/v1/tweets/${id}/retweets`, retweet, { headers: { Authorization: `Bearer ${getUserLocalStorage().token}` } })

      if (response.status !== 201) {
        throw new Error(response.data.message || 'Something went wrong')
      }
      fetchTweet()
    } catch (e) {
      console.log(e)
    }
  }


  return (
    <TweetDetailContext.Provider value={{ tweet, refreshList: fetchTweet, handleAddComment, postUser, commentsList, updateTweets, openCommentModalId, setOpenCommentModalId }} >
      {children}
    </TweetDetailContext.Provider>
  )

}

export default TweetDetailProvider;