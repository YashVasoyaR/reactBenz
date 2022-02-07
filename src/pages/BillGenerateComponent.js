import React from 'react'
import APIHandler from "../utils/APIHandler";
import { Link } from "react-router-dom";
import AutoCompleteMedicine from "../component/AutoCompleteMedicine";

class BillGenerateComponent extends React.Component {
    constructor(props) {
        super(props);
        this.formSubmit = this.formSubmit.bind(this);
    }
    state = {
        errorRes: false,
        errorMessage: "",
        btnMessage: 0,
        sendData: false,
        medicineDetails: [
            {
                sr_no: 1,
                id: 0,
                medicine_name: "",
                qty: "",
                qty_type: "",
                unit_price: "",
                c_gst: "",
                s_gst: "",
                amount: "",
            },
        ],
        currentSrno: 1,
    };

    async formSubmit(event) {
        event.preventDefault();
        console.log(this.state.medicineDetails);
        console.log(event.target.customer_name.value);
        console.log(event.target.address.value);
        console.log(event.target.phone.value);

        this.setState({ btnMessage: 1 });

        var customer_name = event.target.customer_name.value;
        var address = event.target.address.value;
        var phone = event.target.phone.value;

        var apiHandler = new APIHandler();
        var response = await apiHandler.generateBill(
            event.target.customer_name.value,
            event.target.address.value,
            event.target.phone.value,
            this.state.medicineDetails
        );
        console.log(response);
        this.setState({ btnMessage: 0 });
        this.setState({ errorRes: response.data.error });
        this.setState({ errorMessage: response.data.message });
        this.setState({ sendData: true });

        this.billGeneratePrint(
            customer_name,
            address,
            phone,
            this.state.medicineDetails
        );
    }

    billGeneratePrint(customer_name, address, phone, medicineDetails) {
        var billDetails =
            "<style> table{ width:100%;border-collapse:collapse; } td{ padding:5px } th { padding:5px } </style><div>";
        billDetails += "<table border='1'>";
        billDetails += "<tr>";
        billDetails += "<td style='text-align:center' colspan='7'>";
        billDetails += "Bill For Customer";
        billDetails += "</td>";
        billDetails += "</tr>";
        billDetails += "<tr>";
        billDetails += "<td colspan='2'>";
        billDetails += "Name : " + customer_name;
        billDetails += "</td>";
        billDetails += "<td colspan='3'>";
        billDetails += "Address : " + address;
        billDetails += "</td>";
        billDetails += "<td colspan='2'>";
        billDetails += "Phone : " + phone;
        billDetails += "</td>";
        billDetails += "</tr>";
        billDetails += "<tr>";
        billDetails += "<th>";
        billDetails += "SR NO .";
        billDetails += "</th>";
        billDetails += "<th>";
        billDetails += "Name .";
        billDetails += "</th>";
        billDetails += "<th>";
        billDetails += "QTY .";
        billDetails += "</th>";
        billDetails += "<th>";
        billDetails += "QTY TYPE .";
        billDetails += "</th>";
        billDetails += "<th>";
        billDetails += "UNIT PRICE .";
        billDetails += "</th>";
        billDetails += "<th>";
        billDetails += "GST .";
        billDetails += "</th>";
        billDetails += "<th>";
        billDetails += "AMOUNT .";
        billDetails += "</th>";
        billDetails += "</tr>";
        var totalamt = 0;

        for (var i = 0; i < medicineDetails.length; i++) {
            billDetails += "<tr>";
            billDetails += "<td>";
            billDetails += "" + medicineDetails[i].sr_no;
            billDetails += "</td>";
            billDetails += "<td>";
            billDetails += "" + medicineDetails[i].medicine_name;
            billDetails += "</td>";
            billDetails += "<td>";
            billDetails += "" + medicineDetails[i].qty;
            billDetails += "</td>";
            billDetails += "<td>";
            billDetails += "" + medicineDetails[i].qty_type;
            billDetails += "</td>";
            billDetails += "<td>";
            billDetails += "" + medicineDetails[i].unit_price;
            billDetails += "</td>";
            billDetails += "<td>";
            billDetails +=
                "" + medicineDetails[i].c_gst + " " + medicineDetails[i].s_gst;
            billDetails += "</td>";
            billDetails += "<td>";
            billDetails += "" + medicineDetails[i].amount;
            billDetails += "</td>";
            billDetails += "</tr>";

            totalamt += parseInt(medicineDetails[i].amount);
        }

        billDetails += "<tr>";
        billDetails +=
            "<td colspan='6' style='text-align:right;font-weight:bold;background:green;color:white'>";
        billDetails += "Total : " + totalamt;
        billDetails += "<td>";
        billDetails += "</tr>";
        billDetails += "</table>";
        billDetails += "</div>";

        var mywindow = window.open(
            "",
            "Bill Print",
            "height=650&width=900&top=100&left=100"
        );

        mywindow.document.write(billDetails);
        mywindow.print();
    }

    AddMedicineDetails = () => {
        this.state.currentSrno = this.state.currentSrno + 1;
        var srno = this.state.currentSrno;
        this.state.medicineDetails.push({
            sr_no: srno,
            medicine_name: "",
            qty: "",
            qty_type: "",
            unit_price: "",
            c_gst: "",
            s_gst: "",
            amount: "",
        });
        this.setState({});
    };

    RemoveMedicineDetails = () => {
        this.state.currentSrno = this.state.currentSrno - 1;
        if (this.state.medicineDetails.length > 1) {
            this.state.medicineDetails.pop();
        }
        this.setState({});
    };

    showDataInInputs = (index, item) => {
        console.log(index);
        console.log(item);
        this.state.medicineDetails[index].id = item.id;
        this.state.medicineDetails[index].qty = 1;
        this.state.medicineDetails[index].qty_type = "Pieces";
        this.state.medicineDetails[index].unit_price = item.sell_price;
        this.state.medicineDetails[index].c_gst = item.c_gst;
        this.state.medicineDetails[index].s_gst = item.s_gst;
        this.state.medicineDetails[index].medicine_name = item.name;
        this.state.medicineDetails[index].amount =
            parseInt(item.sell_price) + parseInt(item.c_gst) + parseInt(item.s_gst);
        this.setState({});
    };

    qtyChangeUpdate = (event) => {
        var value = event.target.value;
        var index = event.target.dataset.index;

        this.state.medicineDetails[index].amount =
            (parseInt(this.state.medicineDetails[index].unit_price) +
                parseInt(this.state.medicineDetails[index].c_gst) +
                parseInt(this.state.medicineDetails[index].s_gst)) *
            value;
        this.state.medicineDetails[index].qty = value;
        this.setState({});
    };

    render() {
        return (
            < div className="main-panel" >
                <div className="content-wrapper">
                    <div className="page-header"><h3 className="page-title"><span className="page-title-icon bg-gradient-primary text-white mr-2"><i className="mdi mdi-view-list"></i></span> Generate Bill</h3></div>
                    <div className="row">
                        <div className="col-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Generate Bill for Customers</h4>
                                    <form className="forms-sample" onSubmit={this.formSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputName1">Customer Name :</label>
                                            <input
                                                type="text"
                                                id="customer_name"
                                                name="customer_name"
                                                className="form-control"
                                                id="exampleInputName1"
                                                placeholder="Enter Customer Name"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputName1">Address : </label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                className="form-control"
                                                id="exampleInputName1"
                                                placeholder="Enter Address."
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputName1">Phone : </label>
                                            <input
                                                type="text"
                                                id="phone"
                                                name="phone"
                                                className="form-control"
                                                id="exampleInputName1"
                                                placeholder="Enter Customer Phone"
                                            />
                                        </div>
                                        <br />
                                        <h4>Medicine Details</h4>
                                        {this.state.medicineDetails.map((item, index) => (
                                            <div className="row" key={index}>
                                                <div className="col-lg-2">
                                                    <label htmlFor="email_address">SR No : </label>
                                                    <div className="form-group">
                                                        <div className="form-line">
                                                            <input
                                                                type="text"
                                                                id="sr_no"
                                                                name="sr_no"
                                                                className="form-control"
                                                                placeholder="Enter SR No."
                                                                defaultValue={index + 1}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-2">
                                                    <label htmlFor="email_address">
                                                        Medicine Name :{" "}
                                                    </label>
                                                    <div className="form-group">
                                                        <div className="form-line">
                                                            <AutoCompleteMedicine
                                                                itemPostion={index}
                                                                showDataInInputs={this.showDataInInputs}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-2">
                                                    <label htmlFor="email_address">Qty : </label>
                                                    <div className="form-group">
                                                        <div className="form-line">
                                                            <input
                                                                type="text"
                                                                id="qty"
                                                                name="qty"
                                                                className="form-control"
                                                                placeholder="Enter Quantity."
                                                                defaultValue={item.qty}
                                                                data-index={index}
                                                                onChange={this.qtyChangeUpdate}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-2">
                                                    <label htmlFor="email_address">Qty Type : </label>
                                                    <div className="form-group">
                                                        <div className="form-line">
                                                            <input
                                                                type="text"
                                                                id="qty_type"
                                                                name="qty_type"
                                                                className="form-control"
                                                                placeholder="Enter Qty Type."
                                                                defaultValue={item.qty_type}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-2">
                                                    <label htmlFor="email_address">Unit Price : </label>
                                                    <div className="form-group">
                                                        <div className="form-line">
                                                            <input
                                                                type="text"
                                                                id="unit_price"
                                                                name="unit_price"
                                                                className="form-control"
                                                                placeholder="Enter Unit Price."
                                                                defaultValue={item.unit_price}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-2">
                                                    <label htmlFor="email_address">Amount : </label>
                                                    <div className="form-group">
                                                        <div className="form-line">
                                                            <input
                                                                type="text"
                                                                id="amount"
                                                                name="amount"
                                                                className="form-control"
                                                                placeholder="Enter Amount"
                                                                defaultValue={item.amount}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <button
                                                    onClick={this.AddMedicineDetails}
                                                    className="btn btn-inverse-success btn-fw"
                                                    type="button"
                                                >
                                                    ADD MEDICINE DETAILS
                                                </button>
                                            </div>
                                            <div className="col-lg-6">
                                                <button
                                                    onClick={this.RemoveMedicineDetails}
                                                    className="btn btn-inverse-danger btn-fw"
                                                    style={{ margin: "0px 0px 0px -450px" }}
                                                    type="button"
                                                >
                                                    REMOVE MEDICINE DETAILS
                                                </button>
                                            </div>
                                        </div>
                                        <br />
                                        <button
                                            type="submit"
                                            className="btn btn-gradient-primary mr-2"
                                            disabled={this.state.btnMessage == 0 ? false : true}
                                        >
                                            {this.state.btnMessage == 0
                                                ? "Generate Bill"
                                                : "Generating Bill Please Wait.."}
                                        </button>
                                        <br />
                                        {this.state.errorRes == false &&
                                            this.state.sendData == true ? (
                                            <div className="alert alert-success">
                                                <strong>Success!</strong> {this.state.errorMessage}.
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                        {this.state.errorRes == true &&
                                            this.state.sendData == true ? (
                                            <div className="alert alert-danger">
                                                <strong>Failed!</strong>
                                                {this.state.errorMessage}.
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BillGenerateComponent