import { useFormik } from 'formik';
import { signUpSchema } from '../../schemas/SignUpSchema';
import { signUpUser } from '../../services/userService';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';

const SignUp = () => {
  const navigate = useNavigate();

  const onSubmit = async (values, { setStatus }) => {
    const response = await signUpUser(values);
    if (response.status === false) {
      if (response.mensagem.includes('Email')) {
        setStatus({ emailError: response.mensagem });
      } else if (response.mensagem.includes('Usuário')) {
        setStatus({ usernameError: response.mensagem });
      } else {
        alert('Erro: ', response);
      }
    } else {
      const data = await loginUser(values);

      if (data && data.token) {
        navigate('/feed');
      } else {
        alert('Login failed');
      }
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
    status,
  } = useFormik({
    initialValues: {
      nome: '',
      usuario: '',
      email: '',
      senha: '',
    },
    validationSchema: signUpSchema,
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <h1>Criar sua conta</h1>
      <Input
        id="nome"
        type="text"
        placeholder="Nome"
        value={values.nome}
        onChange={handleChange}
        onBlur={handleBlur}
        className={errors.nome && touched.nome ? 'input-error' : ''}
      />
      {errors.nome && touched.nome && <p className="error">{errors.nome}</p>}
      <Input
        id="usuario"
        type="text"
        placeholder="Usuário"
        value={values.usuario}
        onChange={handleChange}
        onBlur={handleBlur}
        className={errors.usuario && touched.usuario ? 'input-error' : ''}
      />
      {errors.usuario && touched.usuario && (
        <p className="error">{errors.usuario}</p>
      )}
      {status && status.usernameError && (
        <p className="error">{status.usernameError}</p>
      )}
      <Input
        id="email"
        type="email"
        placeholder="Email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        className={errors.email && touched.email ? 'input-error' : ''}
      />
      {errors.email && touched.email && <p className="error">{errors.email}</p>}
      {status && status.emailError && (
        <p className="error">{status.emailError}</p>
      )}
      <Input
        id="senha"
        type="password"
        placeholder="Senha"
        value={values.senha}
        onChange={handleChange}
        onBlur={handleBlur}
        className={errors.senha && touched.senha ? 'input-error' : ''}
      />
      {errors.senha && touched.senha && <p className="error">{errors.senha}</p>}
      <Button disabled={isSubmitting} type="submit">
        Inscrever-se
      </Button>
    </form>
  );
};

export default SignUp;
