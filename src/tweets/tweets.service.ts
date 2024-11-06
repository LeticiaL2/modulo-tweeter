import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/users/entities/users.entity'
import { UsersService } from 'src/users/users.service'
import { ResponseListModel, ResponseModel } from 'src/utils/models'
import { Repository } from 'typeorm'
import { CreateTweetDTO } from './dto/create-tweet.dto'
import { ResponseCreateTweetDTO } from './dto/response-tweet.dto'
import { Tweet } from './entities/tweet.entity'
// import { CreateLikeDTO } from './dto/create-like.dto'
import { Comentario } from './entities/comentarios.entity'
import { Like } from './entities/likes.entity'
// import { ResponseModel } from 'src/utils/models'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'
import { Retweet } from './entities/retweet.entity'
import { ForbiddenException } from '@nestjs/common'

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(Comentario)
    private readonly comentarioRepository: Repository<Comentario>,
    @InjectRepository(Retweet)
    private readonly retweetRepository: Repository<Retweet>,
    @InjectEntityManager()
    private manager: EntityManager,
    private readonly userService: UsersService,
  ) {}

  async createTweet(
    createTweetDTO: CreateTweetDTO,
    user: User,
  ): Promise<ResponseModel<ResponseCreateTweetDTO>> {
    if (!createTweetDTO.texto) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 400,
          texto: 'Texto do tweet é obrigatório',
        },
        conteudo: null,
      })
    }

    const tweet = await this.tweetRepository.save({
      texto: createTweetDTO.texto,
      usuario: user,
    })

    const response = {
      status: true,
      mensagem: {
        codigo: 201,
        texto: 'Tweet criado com sucesso',
      },
      conteudo: {
        id: tweet.id,
        texto: tweet.texto,
        usuario: user.usuario,
        usuarioId: user.id,
        nome: user.nome,
        likes: 0,
        comentarios: 0,
        retweets: 0,
        data: tweet.data_criacao,
      },
    }

    return response
  }

  async createComentario(
    createTweetDTO: CreateTweetDTO,
    tweetPaiId: string,
    user: User,
  ) {
    if (!createTweetDTO.texto) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 400,
          texto: 'Texto do comentário é obrigatório',
        },
        conteudo: null,
      })
    }

    const tweet = await this.tweetRepository.findOne({
      where: { id: tweetPaiId },
    })

    if (!tweet) {
      throw new NotFoundException({
        status: false,
        mensagem: {
          codigo: 404,
          texto: 'Tweet não encontrado',
        },
        conteudo: null,
      })
    }

    const response = await this.manager.transaction(
      async transactionalEntityManager => {
        try {
          const comentarioTweet = await transactionalEntityManager.save(Tweet, {
            texto: createTweetDTO.texto,
            usuario: user,
          })

          const comentario = await transactionalEntityManager.save(Comentario, {
            tweetPai: tweet,
            tweet: comentarioTweet,
          })

          return {
            status: true,
            mensagem: {
              codigo: 201,
              texto: 'Comentário criado com sucesso',
            },
            conteudo: {
              id: comentario.id,
              texto: comentarioTweet.texto,
              tweetPaiId,
            },
          }
        } catch (error) {
          throw new InternalServerErrorException({
            status: false,
            mensagem: {
              codigo: 500,
              texto: 'Erro ao criar comentário',
            },
            conteudo: null,
          })
        }
      },
    )
    return response
  }

  async createRetweet(
    createRetweetDTO: CreateTweetDTO,
    tweetPaiId: string,
    user: User,
  ) {
    const tweetPai = await this.tweetRepository.findOne({
      where: { id: tweetPaiId },
    })

    if (!tweetPai) {
      throw new NotFoundException({
        status: false,
        mensagem: {
          codigo: 404,
          texto: 'Tweet não encontrado',
        },
        conteudo: null,
      })
    }

    const response = await this.manager.transaction(
      async transactionalEntityManager => {
        try {
          const retweetTweet = await transactionalEntityManager.save(Tweet, {
            texto: createRetweetDTO.texto ? createRetweetDTO.texto : null,
            usuario: user,
          })

          const retweet = await transactionalEntityManager.save(Retweet, {
            tweetPai,
            tweet: retweetTweet,
          })

          return {
            status: true,
            mensagem: {
              codigo: 201,
              texto: 'Retweet criado com sucesso',
            },
            conteudo: {
              id: retweet.id,
              texto: retweetTweet.texto,
              tweetPaiId,
            },
          }
        } catch (error) {
          throw new InternalServerErrorException({
            status: false,
            mensagem: {
              codigo: 500,
              texto: 'Erro ao criar o retweet',
            },
            conteudo: null,
          })
        }
      },
    )

    return response
  }

  async toggleLike(tweetId: string, user: User) {
    const tweet = await this.tweetRepository.findOne({
      where: { id: tweetId },
    })

    if (!tweet) {
      throw new NotFoundException({
        status: false,
        mensagem: {
          codigo: 404,
          texto: 'Tweet não encontrado',
        },
        conteudo: false,
      })
    }

    const existingLike = await this.likeRepository.findOne({
      where: { usuario: user, tweet },
    })

    if (existingLike) {
      await this.likeRepository.delete(existingLike)
      return {
        status: true,
        mensagem: {
          codigo: 200,
          texto: 'Like removido com sucesso',
        },
        conteudo: true,
      }
    }

    try {
      await this.likeRepository.save({
        usuario: user,
        tweet,
      })
    } catch (error) {
      throw new InternalServerErrorException({
        status: false,
        mensagem: {
          codigo: 500,
          texto: 'Erro ao criar like',
        },
        conteudo: false,
      })
    }

    const response = {
      status: true,
      mensagem: {
        codigo: 201,
        texto: 'Like criado com sucesso',
      },
      conteudo: true,
    }

    return response
  }

  async findAll(
    user: User,
  ): Promise<ResponseListModel<ResponseCreateTweetDTO>> {
    const tweets = await this.tweetRepository.find({
      relations: {
        usuario: true,
        likes: {
          usuario: true,
        },
        comentarios: true,
        tweetPai: true,
        retweets: {
          tweet: {
            usuario: true,
          },
        },
        retweetPai: {
          tweet: {
            usuario: true,
          },
          tweetPai: {
            likes: { usuario: true },
            comentarios: true,
            retweets: {
              tweet: {
                usuario: true,
              },
            },
            usuario: true,
            retweetPai: {
              tweet: {
                usuario: true,
              },
              tweetPai: {
                likes: { usuario: true },
                comentarios: true,
                retweets: {
                  tweet: {
                    usuario: true,
                  },
                },
                usuario: true,
              },
            },
          },
        },
      },
      order: {
        data_criacao: 'DESC',
      },
    })

    const mappedTweets = tweets
      .filter(
        tweet =>
          Object.keys(tweet.tweetPai).length === 0 && tweet.excluido === false,
      )
      .map(tweet => {
        return {
          id: tweet.id,
          texto: tweet.texto,
          usuario: tweet.usuario.usuario,
          usuarioId: tweet.usuario.id,
          nome: tweet.usuario.nome,
          likes: tweet.likes.length,
          comentarios: tweet.comentarios.length,
          retweets: tweet.retweets.filter(
            retweet => retweet.tweet.excluido === false,
          ).length,
          data: tweet.data_criacao,
          isRemoved: tweet.excluido,
          isLikedByUser: tweet.likes.some(like => like.usuario.id === user.id),
          isRetweetedByUser: tweet.retweets.some(
            retweet =>
              retweet.tweet.usuario.id === user.id &&
              retweet.tweet.excluido === false,
          ),
          isRetweetedWithoutQuoteByUser: tweet.retweets.filter(
            retweet =>
              retweet.tweet.usuario.id === user.id &&
              retweet.tweet.texto === null &&
              retweet.tweet.excluido === false,
          ),
          retweetPai: tweet.retweetPai[0]
            ? {
                id: tweet.retweetPai[0].tweetPai.id,
                texto: tweet.retweetPai[0].tweetPai.texto,
                usuario: tweet.retweetPai[0].tweetPai.usuario.usuario,
                usuarioId: tweet.retweetPai[0].tweetPai.usuario.id,
                nome: tweet.retweetPai[0].tweetPai.usuario.nome,
                likes: tweet.retweetPai[0].tweetPai.likes.length,
                comentarios: tweet.retweetPai[0].tweetPai.comentarios.length,
                retweets: tweet.retweetPai[0].tweetPai.retweets.filter(
                  retweet => retweet.tweet.excluido === false,
                ).length,
                isRemoved: tweet.retweetPai[0].tweetPai.excluido,
                data: tweet.retweetPai[0].tweetPai.data_criacao,
                isLikedByUser: tweet.retweetPai[0].tweetPai.likes.some(
                  like => like.usuario.id === user.id,
                ),
                isRetweetedByUser: tweet.retweetPai[0].tweetPai.retweets.some(
                  retweet =>
                    retweet.tweet.usuario.id === user.id &&
                    retweet.tweet.excluido === false,
                ),
                isRetweetedWithoutQuoteByUser:
                  tweet.retweetPai[0].tweetPai.retweets.filter(
                    retweet =>
                      retweet.tweet.usuario.id === user.id &&
                      retweet.tweet.texto === null &&
                      retweet.tweet.excluido === false,
                  ),
                retweetPai: tweet.retweetPai[0].tweetPai.retweetPai[0]
                  ? {
                      id: tweet.retweetPai[0].tweetPai.retweetPai[0].tweetPai
                        .id,
                      texto:
                        tweet.retweetPai[0].tweetPai.retweetPai[0].tweetPai
                          .texto,
                      usuario:
                        tweet.retweetPai[0].tweetPai.retweetPai[0].tweetPai
                          .usuario.usuario,
                      usuarioId:
                        tweet.retweetPai[0].tweetPai.retweetPai[0].tweetPai
                          .usuario.id,
                      nome: tweet.retweetPai[0].tweetPai.retweetPai[0].tweetPai
                        .usuario.nome,
                      likes:
                        tweet.retweetPai[0].tweetPai.retweetPai[0].tweetPai
                          .likes.length,
                      comentarios:
                        tweet.retweetPai[0].tweetPai.retweetPai[0].tweetPai
                          .comentarios.length,
                      retweets:
                        tweet.retweetPai[0].tweetPai.retweetPai[0].tweetPai.retweets.filter(
                          retweet => retweet.tweet.excluido === false,
                        ).length,
                      isRemoved:
                        tweet.retweetPai[0].tweetPai.retweetPai[0].tweetPai
                          .excluido,
                      data: tweet.retweetPai[0].tweetPai.retweetPai[0].tweetPai
                        .data_criacao,
                      isLikedByUser:
                        tweet.retweetPai[0].tweetPai.retweetPai[0].tweetPai.likes.some(
                          like => like.usuario.id === user.id,
                        ),
                      isRetweetedByUser:
                        tweet.retweetPai[0].tweetPai.retweetPai[0].tweetPai.retweets.some(
                          retweet =>
                            retweet.tweet.usuario.id === user.id &&
                            retweet.tweet.excluido === false,
                        ),
                    }
                  : null,
              }
            : null,
        }
      })

    const response = {
      status: true,
      mensagem: {
        codigo: 200,
        texto: 'Listagem de tweets',
      },
      conteudo: mappedTweets,
    }
    return response
  }

  async findOne(tweetId: string, user: User) {
    const tweet = await this.tweetRepository.findOne({
      where: { id: tweetId },
      relations: {
        usuario: true,
        likes: {
          usuario: true,
        },
        retweets: {
          tweet: {
            usuario: true,
          },
        },
        retweetPai: {
          tweetPai: {
            usuario: true,
          },
        },
        comentarios: {
          tweet: {
            likes: {
              usuario: true,
            },
            comentarios: true,
            retweets: {
              tweet: {
                usuario: true,
              },
            },
            usuario: true,
          },
        },
      },
      order: {
        data_criacao: 'DESC',
      },
    })

    if (!tweet) {
      throw new NotFoundException({
        status: false,
        mensagem: {
          codigo: 404,
          texto: 'Tweet não encontrado',
        },
        conteudo: null,
      })
    }

    const mappedTweet = {
      id: tweet.id,
      texto: tweet.texto,
      data: tweet.data_criacao,
      usuario: tweet.usuario.usuario,
      usuarioId: tweet.usuario.id,
      nome: tweet.usuario.nome,
      isRemoved: tweet.excluido,
      isLikedByUser: tweet.likes.some(like => like.usuario.id === user.id),
      isRetweetedByUser: tweet.retweets.some(
        retweet =>
          retweet.tweet.usuario.id === user.id &&
          retweet.tweet.excluido === false,
      ),
      isRetweetedWithoutQuoteByUser: tweet.retweets.filter(
        retweet =>
          retweet.tweet.usuario.id === user.id &&
          retweet.tweet.texto === null &&
          retweet.tweet.excluido === false,
      ),
      likes: tweet.likes.length,
      comentarios: tweet.comentarios.length,
      retweets: tweet.retweets.filter(
        retweet => retweet.tweet.excluido === false,
      ).length,
      retweetPai: tweet.retweetPai[0]
        ? {
            id: tweet.retweetPai[0].tweetPai.id,
            texto: tweet.retweetPai[0].tweetPai.texto,
            data: tweet.retweetPai[0].tweetPai.data_criacao,
            usuario: tweet.retweetPai[0].tweetPai.usuario.usuario,
            usuarioId: tweet.retweetPai[0].tweetPai.usuario.id,
            nome: tweet.retweetPai[0].tweetPai.usuario.nome,
          }
        : null,
      comentariosArray:
        tweet.comentarios.length !== 0
          ? tweet.comentarios
              .filter(comentario => !comentario.tweet.excluido)
              .map(comentario => {
                const {
                  id,
                  texto,
                  data_criacao,
                  likes,
                  comentarios,
                  retweets,
                  excluido,
                  usuario: usuarioComentario,
                } = comentario.tweet

                return {
                  id,
                  texto,
                  usuario: usuarioComentario.usuario,
                  usuarioId: usuarioComentario.id,
                  nome: usuarioComentario.nome,
                  likes: likes.length,
                  comentarios: comentarios.length,
                  retweets: retweets.filter(retweet => !retweet.tweet.excluido)
                    .length,
                  data: data_criacao,
                  isRemoved: excluido,
                  isLikedByUser: likes.some(
                    like => like.usuario.id === user.id,
                  ),
                  isRetweetedByUser: retweets.some(
                    retweet =>
                      retweet.tweet.usuario.id === user.id &&
                      retweet.tweet.excluido === false,
                  ),
                  isRetweetedWithoutQuoteByUser: retweets.filter(
                    retweet =>
                      retweet.tweet.usuario.id === user.id &&
                      retweet.tweet.texto === null &&
                      retweet.tweet.excluido === false,
                  ),
                }
              })
          : [],
    }

    const response = {
      status: true,
      mensagem: {
        codigo: 200,
        texto: 'Tweet encontrado',
      },
      conteudo: mappedTweet,
    }

    return response
  }

  async deleteTweet(tweetId: string, user: User) {
    const tweet = await this.tweetRepository.findOne({
      where: { id: tweetId },
      relations: ['usuario'],
    })

    if (!tweet) {
      throw new NotFoundException({
        status: false,
        mensagem: {
          codigo: 404,
          texto: 'Tweet não encontrado',
        },
        conteudo: false,
      })
    }

    if (tweet.usuario.id !== user.id) {
      throw new ForbiddenException({
        status: false,
        mensagem: {
          codigo: 403,
          texto: 'Você não pode excluir esse tweet',
        },
        conteudo: false,
      })
    }

    tweet.excluido = true
    tweet.texto = null

    try {
      await this.tweetRepository.save(tweet)
    } catch (error) {
      throw new InternalServerErrorException({
        status: false,
        mensagem: {
          codigo: 500,
          texto: 'Erro ao excluir tweet',
        },
        conteudo: false,
      })
    }

    const response = {
      status: true,
      mensagem: {
        codigo: 200,
        texto: 'Tweet excluído com sucesso',
      },
      conteudo: true,
    }

    return response
  }
}
