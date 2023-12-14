import React, { useRef } from 'react'
import { createPortal } from 'react-dom'
import { getUserLocalStorage } from '../../../contexts/util'
import Api from '../../../services/api'
import CloseIcon from '../../atoms/SVGIcons/CloseIcon'
import ReplyTweet from '../ReplyTweet'
import { Container, ModalContainer } from './styles'

const modalElement = document.getElementById('portal')

function Modal({ showModal, setShowModal, children, userData, isComment }) {
  const modalRef = useRef()
  function closeModal(e) {
    if (modalRef.current === e.target) {
      setShowModal(false)
    }
  }

  async function handleReplyTweetWithoutQuote() {
    console.log(userData)
    return
    try {
      const response = await Api.post(`api/v1/tweets/${userData.id}/retweets`, {}, { headers: { Authorization: `Bearer ${getUserLocalStorage().token}` } })
      setShowModal(false)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleReplyTweetWithQuote(replyData) {
    try {
      const response = await Api.post(`api/v1/tweets/${userData.id}/retweets`, replyData, { headers: { Authorization: `Bearer ${getUserLocalStorage().token}` } })
      setShowModal(false)
    } catch (error) {
      console.log(error)
    }
  }


  if (showModal) {
    if (isComment) {
      return createPortal(
        <Container ref={modalRef} onClick={closeModal}>
          <ModalContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div onClick={() => setShowModal(prev => !prev)}>
                <CloseIcon />
              </div>
              <div>Draft</div>
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                {children}
              </div>
              <ReplyTweet onReplyTweet={handleReplyTweetWithoutQuote} postUser={userData.usuario} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {/* <Button>Reply</Button> */}
            </div>
          </ModalContainer>
        </Container>,
        modalElement
      )
    }

    return createPortal
      (<Container ref={modalRef} onClick={closeModal}>
        <ModalContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div onClick={() => setShowModal(prev => !prev)}>
              <CloseIcon />
            </div>
            <div>Draft</div>
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              {children}
            </div>
            <ReplyTweet onReplyTweet={handleReplyTweetWithQuote} postUser={userData.usuario} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {/* <Button>Reply</Button> */}
          </div>
        </ModalContainer>
      </Container>,
        modalElement)
  }

  return null
}

export default Modal