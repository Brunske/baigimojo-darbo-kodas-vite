import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import "./MainLayout.scss"

export default function HomeLayout() {
    return (
        <div className="home-layout">
            <header>
                <NavLink to="/main" className="logo">Žiniukas</NavLink>
                <nav>
                    <ul className='nav__links'>
                        <li><NavLink to="info">Info</NavLink></li>
                        <li><NavLink to="about">About</NavLink></li>

                    </ul>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}
