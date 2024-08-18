import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ items }) => {
	return (
		<div className="ps-3">
			<nav aria-label="breadcrumb">
				<ol className="breadcrumb">
					{items.map((item, index) => (
						<li
							key={index}
							className={`breadcrumb-item ${
								item.active ? "active" : ""
							}`}
							aria-current={item.active ? "page" : undefined}
						>
							{item.active ? (
								item.label
							) : (
								<Link to={item.path}>{item.label}</Link>
							)}
						</li>
					))}
				</ol>
			</nav>
		</div>
	);
};

export default Breadcrumb;
