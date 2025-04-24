import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import MarkerClusterGroup from "react-leaflet-cluster"
import dayjs from "dayjs";
// import { addressPoints } from '../utils/realworld'

type Location = {
  key?: string;
  instituteId: string;
  instituteName: string;
  coordinates: { lat: number, long: number },
  userEnrollCount: number,
  courses: {
    key?: string;
    courseId: string;
    courseName: string;
    users: {
      key?: string;
      userId: string;
      firstName: string;
      lastName: string;
      email: string;
      enrollCreateAt: string;
    }[]
  }[]
}

const headers: string[] = ['ชื่อจริง', 'นามสกุล', 'อีเมล', 'เวลาลงทะเบียน'];

export default function MapRender({ locations }: { locations: Location[] }) {
  return (
    <MapContainer center={[13.736717, 100.523186]} zoom={6} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup
        chunkedLoading
      >
        {locations.map((location, index: number) => (
          <Marker
            key={index}
            position={[location.coordinates.lat, location.coordinates.long]}
            title={location.instituteName}
          >
            <Popup minWidth={500}>
              {
                location.courses.map((course, cIndex) => (
                  <details open key={`course-${cIndex}`}>
                    <summary>{course.courseName}</summary>
                    <table cellPadding={'8px'} style={{
                      width: '500px',
                      border: '1px solid black',
                      borderRadius: '4px',
                      borderCollapse: 'separate',
                      whiteSpace: 'nowrap',
                      margin: '10px'
                    }}>
                      <thead>
                        <tr>
                          {
                            headers.map((header) => (
                              <th key={`${header}`}>{header}</th>
                            ))
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {
                          course.users?.map((user, uIndex) => (
                            <tr key={`user-${uIndex}`}>
                              <td>{user.firstName}</td>
                              <td>{user.lastName}</td>
                              <td>{user.email}</td>
                              <td>{dayjs(user.enrollCreateAt).format('DD MMMM YYYY HH:mm:ss')}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </details>
                ))
              }
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  )
}