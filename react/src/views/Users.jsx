import React from 'react'
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from 'react-router-dom'
import {useStateContext} from "../context/ContextProvider.jsx";
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/20/solid'

export default function Users() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({});
  const [links, setLinks] = useState({});
  const [hrefLinks, setHrefLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()
  const params = new URLSearchParams(location.search)

  useEffect(() => {
    getUsers();
  }, [])

  const goToEdit = user => {
    return <redirect to={`/users/${user.id}`}/>

  }

  const onDeleteClick = user => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }
    axiosClient.delete(`/users/${user.id}`)
      .then(() => {
        setNotification('User was successfully deleted')
        getUsers()
      })
  }

  const getUsers = () => {
    setLoading(true)
    axiosClient.get('/users?page=' + params.get('page'))
      .then(({data}) => {
        setLoading(false)
        setUsers(data.data)
        setMeta(data.meta)
        setLinks(data.links)
        setHrefLinks(data.meta.links)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <div className="usersDiv">
        <h1>Users</h1>
        <Link className="btn-add" to="/users/new">Add new</Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Create Date</th>
            <th>Actions</th>
          </tr>
          </thead>
          {loading &&
            <tbody>
            <tr>
              <td colSpan="5" class="text-center">
                Loading...
              </td>
            </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.created_at}</td>
                <td>
                  <Link className="btn-edit" to={'/users/' + u.id}>Edit</Link>
                  &nbsp;
                  <Link className="btn-delete" onClick={ev => onDeleteClick(u)}>Delete</Link>
                </td>
              </tr>
            ))}
            </tbody>
          }
        </table>
        {!loading &&
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">

              <a
                href={links.prev}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                href={links.next}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{meta.from}</span> to <span
                  className="font-medium">{meta.to}</span> of{' '}
                  <span className="font-medium">{meta.total}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <a
                    href={links.prev}
                    className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true"/>
                  </a>
                  {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
                  {
                    hrefLinks.map((href, i) => {
                      if (href.active) {
                        return i > 0 && i <= meta.last_page && <a
                          href={href.url}
                          aria-current="page"
                          className="relative z-10 inline-flex items-center border border-indigo-600 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20"
                        >
                          {i}
                        </a>
                      }
                      return i > 0 && i <= meta.last_page && <a
                        href={href.url}
                        aria-current="page"
                        className="relative z-10 inline-flex items-center border border-gray-600 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 focus:z-20"
                      >
                        {i}
                      </a>
                    })
                  }
                  <a
                    href={links.next}
                    className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true"/>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}
