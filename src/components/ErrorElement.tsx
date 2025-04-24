import { Result } from "antd";
import { useEffect } from "react";
import { ErrorResponse, useRouteError } from "react-router-dom"

export default function ErrorElement() {
  const { status } = useRouteError() as ErrorResponse;
  useEffect(() => {
    console.log(status);
  }, [])

  const ResultResponse = () => {
    const style: React.CSSProperties = { marginTop: screen.height / 4 }
    switch (status) {
      case undefined:
        return <Result status={500} title={500} subTitle="Sorry, something went wrong." style={style} />
      case 404:
        return <Result status={404} title={400} subTitle="Sorry, the page you visited does not exist." style={style} />
      default:
        break;
    }
  }
  return <ResultResponse />
}