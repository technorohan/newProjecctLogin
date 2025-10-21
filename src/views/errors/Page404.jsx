import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Page404() {
  const navigator = useNavigate();
  return <div className="page404">
    Page not found
    <button onClick={()=> navigator('/user/dashboard')}>Goto Home</button>
    </div>;
}
