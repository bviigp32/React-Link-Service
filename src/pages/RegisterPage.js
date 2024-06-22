import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import Label from "../components/Label";
import Input from "../components/Input";
import Button from "../components/Button";
import HorizontalRule from "../components/HorizontalRule";
import Link from "../components/Link";
import GoogleImage from "../assets/google.svg";
import styles from "./RegisterPage.module.css";
import { useToaster } from "../contexts/ToasterProvider";

function RegisterPage() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });
  const navigate = useNavigate();
  const toast = useToaster();

  function handleChange(e) {
    const { name, value } = e.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (values.password !== values.passwordRepeat) {
      toast("warn", "비밀번호가 일치하지 않습니다.");
      return;
    }
    const { name, email, password } = values;

    try {
      await axios.post("/users", {
        name,
        email,
        password,
      });
      // 회원 생성이 성공하면 로그인 페이지로 이동합니다.
      navigate("/me");
    } catch (error) {
      if (error.response) {
        // 서버 응답이 있는 경우
        if (error.response.status === 409) {
          toast("error", "이 이메일 주소는 이미 사용 중입니다.");
        } else {
          toast("error", `서버 오류: ${error.response.data.error}`);
        }
      } else {
        // 네트워크 오류 등 서버 응답이 없는 경우
        toast("error", "네트워크 오류가 발생했습니다. 나중에 다시 시도하세요.");
      }
    }
  }

  return (
    <>
      <h1 className={styles.Heading}>회원가입</h1>
      <Button
        className={styles.GoogleButton}
        type="button"
        appearance="outline"
      >
        <img src={GoogleImage} alt="Google" />
        구글로 시작하기
      </Button>
      <HorizontalRule className={styles.HorizontalRule}>또는</HorizontalRule>
      <form className={styles.Form} onSubmit={handleSubmit}>
        <Label className={styles.Label} htmlFor="name">
          이름
        </Label>
        <Input
          id="name"
          className={styles.Input}
          name="name"
          type="text"
          placeholder="김링크"
          value={values.name}
          onChange={handleChange}
        />
        <Label className={styles.Label} htmlFor="email">
          이메일
        </Label>
        <Input
          id="email"
          className={styles.Input}
          name="email"
          type="email"
          placeholder="example@email.com"
          value={values.email}
          onChange={handleChange}
        />
        <Label className={styles.Label} htmlFor="password">
          비밀번호
        </Label>
        <Input
          id="password"
          className={styles.Input}
          name="password"
          type="password"
          placeholder="비밀번호"
          value={values.password}
          onChange={handleChange}
        />
        <Label className={styles.Label} htmlFor="passwordRepeat">
          비밀번호 확인
        </Label>
        <Input
          id="passwordRepeat"
          className={styles.Input}
          name="passwordRepeat"
          type="password"
          placeholder="비밀번호 확인"
          value={values.passwordRepeat}
          onChange={handleChange}
        />
        <Button className={styles.Button}>회원가입</Button>
        <div>
          이미 회원이신가요? <Link to="/login">로그인하기</Link>
        </div>
      </form>
    </>
  );
}

export default RegisterPage;
