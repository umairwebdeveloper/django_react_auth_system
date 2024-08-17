import React from "react";

const DashboardPage = () => {
	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-md-9">
					<div className="py-3">
						<h2>Dashboard</h2>
						<p>
							Welcome to your dashboard! Here you can manage your
							profile, settings, and other features.
						</p>

						<div className="row">
							<div className="col-md-4">
								<div className="card mb-4">
									<div className="card-body">
										<h5 className="card-title">
											Card Title 1
										</h5>
										<p className="card-text">
											Some quick example text to build on
											the card title and make up the bulk
											of the card's content.
										</p>
										<a href="#" className="btn btn-primary">
											Go somewhere
										</a>
									</div>
								</div>
							</div>
							<div className="col-md-4">
								<div className="card mb-4">
									<div className="card-body">
										<h5 className="card-title">
											Card Title 2
										</h5>
										<p className="card-text">
											Some quick example text to build on
											the card title and make up the bulk
											of the card's content.
										</p>
										<a href="#" className="btn btn-primary">
											Go somewhere
										</a>
									</div>
								</div>
							</div>
							<div className="col-md-4">
								<div className="card mb-4">
									<div className="card-body">
										<h5 className="card-title">
											Card Title 3
										</h5>
										<p className="card-text">
											Some quick example text to build on
											the card title and make up the bulk
											of the card's content.
										</p>
										<a href="#" className="btn btn-primary">
											Go somewhere
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
