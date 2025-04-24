import dayjs from "dayjs";
import { useEffect } from "react";

declare global {
  interface Window {
    longdo: any;
    lmc: any;
  }
}

type instituteProps = {
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

export default function LongdoMap({ institutes }: { institutes: instituteProps[] }) {

  useEffect(() => {
    const mapId = document.getElementById('map');
    if (mapId) {
      mapId.setAttribute('style', 'height: 100vh');
    }
    const renderHTML = (
      enroll: {
        instituteName: string,
        courses: {
          courseName: string,
          users: {
            firstName: string,
            lastName: string,
            email: string,
            enrollCreateAt: string
          }[]
        }[]
      }
    ) => {
      const tag = document.createElement('div')
      tag.setAttribute('style', 'padding: 0 20px 10px; position: absolute; bottom: 46px; min-width: 400px; box-shadow: 0 15px 30px 0 rgba(0,0,0,0.11),0 5px 15px 0 rgba(0,0,0,0.08); background-color: #ffffff;border-radius: 0.5rem;border-left: 0 solid #00ff99;')
      const p1 = document.createElement('p');
      p1.setAttribute('style', 'width: fit-content; font-weight: bold;')
      const text1 = document.createTextNode(`${enroll.instituteName || ''}`);
      p1.append(text1);
      tag.appendChild(p1);

      enroll.courses.forEach(course => {
        
        if (course.users && course.users.length > 0) {
          const p = document.createElement('p');
          const details = document.createElement('details');
          details.setAttribute('open', 'true')
          const title = document.createElement('summary');
          // title.style = 'font-weight: bold;'
          title.append(document.createTextNode(course.courseName));
          const table = document.createElement('table');
          table.setAttribute('style', 'border: 1px solid black;border-collapse: separate; border-radius:4px; white-space:nowrap; margin: 0 0 0')
          table.setAttribute('cellpadding', '8px');
          const thead = document.createElement('thead');
          const row = document.createElement('tr');

          const headers: string[] = ['ชื่อจริง', 'นามสกุล', 'อีเมล', 'เวลาลงทะเบียน'];
          headers.forEach((header) => {
            const cell = document.createElement('th');
            const cellText = document.createTextNode(header);
            cell.appendChild(cellText);
            row.appendChild(cell);
          });

          course.users?.forEach(user => {
            const rowUser = document.createElement('tr');
            // const enrollCreateAt = new Date(user.enrollCreateAt).toLocaleTimeString('th-TH', {
            //   year: 'numeric',
            //   month: '2-digit',
            //   day: '2-digit',
            //   hour: '2-digit',
            //   minute: '2-digit',
            //   second: '2-digit',
            // }).replace(/\//g, '-').replace(',', '');
            const headers: string[] = [user.firstName, user.lastName, user.email, dayjs(user.enrollCreateAt).format('DD MMMM YYYY HH:mm:ss')];
            headers.forEach(header => {
              const cell = document.createElement('td');
              const cellText = document.createTextNode(header);
              cell.appendChild(cellText);
              rowUser.appendChild(cell);
            });
            row.appendChild(rowUser)
          });
          thead.appendChild(row);
          table.appendChild(thead);
          p.appendChild(table);
          details.appendChild(p);
          details.appendChild(title);
          tag.appendChild(details);
        } else {
          const ul = document.createElement('ul');
          const li = document.createElement('li');
          li.append(document.createTextNode(course.courseName))
          ul.appendChild(li);
          tag.appendChild(ul);
        }

      });
      return tag.outerHTML;
    }
    // map.bound({
    //   minLon: 100, minLat: 13,
    //   maxLon: 101, maxLat: 14
    // }, {
    //   lat: 13.764938,
    //   lon: 100.570108
    // }, false);
    // map.Event.bind("ready", function () {
    //   map.Renderer.setLayoutProperty('label_admin', 'visibility', 'none');
    //   map.zoomRange({ min: 1, max: 6 });
    //   map.zoom(5, true);
    //   // แสดงขอบเขตประเทศที่ต้องการ
    //   map.Overlays.load(new window.longdo.Overlays.Object('IN', 'WG', { simplify: 0.02, lineWidth: 2 })); // 'IN' คือ รหัสประเทศอินเดีย
    // });
    if (institutes) {
      if (institutes.length === 1) {
        const { lat, long } = institutes[0].coordinates;
        const map = new window.longdo.Map({
          // layer: [window.longdo.Layers.POLITICAL],
          // location: { lat, lon: long },
          placeholder: mapId,
          language: 'th',
          zoomRange: { min: 2, max: 18 },
          zoom: 6,
        });
        const marker = new window.longdo.Marker({ lon: long, lat: lat }, {
          popup: {
            html: renderHTML(institutes[0])
          },
        });
        map.bound({
          minLon: 100, minLat: 13,
          maxLon: 101, maxLat: 14
        }, {
          lat: lat,
          lon: long
        }, false);
        map.Overlays.add(marker)
      } else {
        const map = new window.longdo.Map({
          // layer: [window.longdo.Layers.POLITICAL],
          placeholder: mapId,
          language: 'th',
          zoomRange: { min: 2, max: 18 },
          zoom: 6,
        });
        const markercluster = new window.lmc.MarkerCluster(map, { minClusterSize: 3 });
        institutes.forEach((institute) => {
          if (institute.coordinates) {
            const { lat, long } = institute.coordinates;
            markercluster.addMarkers(new window.longdo.Marker({ lat: lat, lon: long }, {
              popup: {
                html: renderHTML(institute)
              },
            }));
          }
        });
        markercluster.render();
      }
    }
    // const marker = new window.longdo.Marker(
    //   { lon: 100.56, lat: 13.74 },
    //   {
    //     title: 'Marker',
    //     detail: 'Drag me',
    //     popup: {
    //       html: `<div style="padding: 1rem;
    //               position: absolute;
    //               bottom: 46px;
    //               left: -90px;
    //               width: 150px;
    //               box-shadow: 0 15px 30px 0 rgba(0,0,0,0.11),0 5px 15px 0 rgba(0,0,0,0.08);
    //               background-color: #ffffff;
    //               border-radius: 0.5rem;
    //               border-left: 0 solid #00ff99;">โรงเรียนบ้านหนองมันต์</div>`,
    //     },
    //     // visibleRange: { min: 1, max: 9 },
    //     // weight: window.longdo.OverlayWeight.Top,
    //   }
    // );
    return () => {
      // const map = document.getElementById('map');
      // map?.remove();
    }
  }, [institutes])

  return (
    <div id="map" />
  )
}