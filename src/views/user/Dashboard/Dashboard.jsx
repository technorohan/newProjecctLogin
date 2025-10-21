import React from 'react';
import { Helmet } from 'react-helmet';

export default function Dashboard() {


	return (
		<>
			<Helmet>
				<title> Dashboard</title>
			</Helmet>

			<div className='dashboard-main'>
				<div class="title">
					<div class="left">
						<h3>Dashboard</h3>
					</div>

				</div>
			</div>
		</>
	);
}

