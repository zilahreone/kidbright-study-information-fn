import { useKeycloak } from "@react-keycloak/web";
import { fetchAPI } from "../utils";

export default function InstituteQuery({ query }: { query: string }) {
  const { keycloak } = useKeycloak();
  if (query === '') {
    return null;
  }

  const institutes = async () => {
    return await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/institute?instituteName=${query}`, keycloak.token);
  }
  return (
    <></>
  )
}