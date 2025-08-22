using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_mart.Migrations
{
    /// <inheritdoc />
    public partial class initialcreate3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "config_master",
                columns: table => new
                {
                    config_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    config_name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_config_master", x => x.config_id);
                });

            migrationBuilder.CreateTable(
                name: "prod_detail_master",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    product_id = table.Column<int>(type: "int", nullable: false),
                    config_id = table.Column<int>(type: "int", nullable: false),
                    config_dtls = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_prod_detail_master", x => x.id);
                    table.ForeignKey(
                        name: "FK_prod_detail_master_config_master_config_id",
                        column: x => x.config_id,
                        principalTable: "config_master",
                        principalColumn: "config_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_prod_detail_master_config_id",
                table: "prod_detail_master",
                column: "config_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "prod_detail_master");

            migrationBuilder.DropTable(
                name: "config_master");
        }
    }
}
