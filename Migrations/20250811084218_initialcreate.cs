using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_mart.Migrations
{
    /// <inheritdoc />
    public partial class initialcreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ctg_master",
                columns: table => new
                {
                    ctg_master_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ctg_id = table.Column<string>(type: "varchar(20)", nullable: false),
                    sub_ctg_name = table.Column<string>(type: "varchar(20)", nullable: false),
                    ctg_name = table.Column<string>(type: "varchar(30)", nullable: false),
                    ctg_img_path = table.Column<string>(type: "varchar(50)", nullable: false),
                    flag = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ctg_master", x => x.ctg_master_id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    username = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    phone_no = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    email = table.Column<string>(type: "nvarchar(320)", maxLength: 320, nullable: false),
                    password = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    loyalty_points = table.Column<int>(type: "int", nullable: false),
                    loyalty = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.user_id);
                });

            migrationBuilder.CreateTable(
                name: "product_master",
                columns: table => new
                {
                    product_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    prod_name = table.Column<string>(type: "varchar(20)", nullable: false),
                    prod_sdesc = table.Column<string>(type: "varchar(200)", nullable: false),
                    prod_bdesc = table.Column<string>(type: "varchar(1000)", nullable: false),
                    mrp_price = table.Column<int>(type: "int", nullable: true),
                    loyalty_points = table.Column<int>(type: "int", nullable: true),
                    product_img = table.Column<string>(type: "varchar(50)", nullable: false),
                    loyal_price = table.Column<int>(type: "int", nullable: true),
                    ctg_master_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_product_master", x => x.product_id);
                    table.ForeignKey(
                        name: "FK_product_master_ctg_master_ctg_master_id",
                        column: x => x.ctg_master_id,
                        principalTable: "ctg_master",
                        principalColumn: "ctg_master_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "cart_master",
                columns: table => new
                {
                    cart_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    cart_dt = table.Column<DateTime>(type: "date", nullable: false),
                    user_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cart_master", x => x.cart_id);
                    table.ForeignKey(
                        name: "FK_cart_master_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "invoice_master",
                columns: table => new
                {
                    invoice_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    invoice_date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    total_payment = table.Column<double>(type: "float", nullable: false),
                    tax = table.Column<double>(type: "float", nullable: false),
                    final_payment = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_invoice_master", x => x.invoice_id);
                    table.ForeignKey(
                        name: "FK_invoice_master_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "cart_details",
                columns: table => new
                {
                    cart_d_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    cart_id = table.Column<int>(type: "int", nullable: false),
                    product_id = table.Column<int>(type: "int", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false),
                    mrp = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    loyal_price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    loyalty_points = table.Column<int>(type: "int", nullable: false),
                    purchase_mode = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cart_details", x => x.cart_d_id);
                    table.ForeignKey(
                        name: "FK_cart_details_cart_master_cart_id",
                        column: x => x.cart_id,
                        principalTable: "cart_master",
                        principalColumn: "cart_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_cart_details_product_master_product_id",
                        column: x => x.product_id,
                        principalTable: "product_master",
                        principalColumn: "product_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "invoice_details",
                columns: table => new
                {
                    invoice_dtl_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    invoice_id = table.Column<int>(type: "int", nullable: false),
                    product_id = table.Column<int>(type: "int", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false),
                    mrp = table.Column<double>(type: "float", nullable: false),
                    loyal_price = table.Column<double>(type: "float", nullable: false),
                    loyalty_points = table.Column<int>(type: "int", nullable: false),
                    purchase_mode = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_invoice_details", x => x.invoice_dtl_id);
                    table.ForeignKey(
                        name: "FK_invoice_details_invoice_master_invoice_id",
                        column: x => x.invoice_id,
                        principalTable: "invoice_master",
                        principalColumn: "invoice_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_invoice_details_product_master_product_id",
                        column: x => x.product_id,
                        principalTable: "product_master",
                        principalColumn: "product_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_cart_details_cart_id",
                table: "cart_details",
                column: "cart_id");

            migrationBuilder.CreateIndex(
                name: "IX_cart_details_product_id",
                table: "cart_details",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_cart_master_user_id",
                table: "cart_master",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_invoice_details_invoice_id",
                table: "invoice_details",
                column: "invoice_id");

            migrationBuilder.CreateIndex(
                name: "IX_invoice_details_product_id",
                table: "invoice_details",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_invoice_master_user_id",
                table: "invoice_master",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_product_master_ctg_master_id",
                table: "product_master",
                column: "ctg_master_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "cart_details");

            migrationBuilder.DropTable(
                name: "invoice_details");

            migrationBuilder.DropTable(
                name: "cart_master");

            migrationBuilder.DropTable(
                name: "invoice_master");

            migrationBuilder.DropTable(
                name: "product_master");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "ctg_master");
        }
    }
}
