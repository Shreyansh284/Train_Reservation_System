using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedFieldsInTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AddedOn",
                table: "TrainWaitlists");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "TrainWaitlists");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "Users",
                newName: "IsActive");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "Trains",
                newName: "IsActive");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_PNR",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "PNR",
                table: "Bookings");

    //         migrationBuilder.Sql(@"DROP INDEX IX_Bookings_PNR ON Bookings");
    //
    //         migrationBuilder.Sql(@"ALTER TABLE Bookings DROP COLUMN PNR");
    //
    //         migrationBuilder.Sql(@"
    // ALTER TABLE Bookings ADD PNR BIGINT IDENTITY(1000000,1) NOT NULL");
    //
    //         migrationBuilder.Sql(@"CREATE INDEX IX_Bookings_PNR ON Bookings(PNR)");




        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "Users",
                newName: "IsDeleted");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "Trains",
                newName: "IsDeleted");

            migrationBuilder.AddColumn<DateTime>(
                name: "AddedOn",
                table: "TrainWaitlists",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Position",
                table: "TrainWaitlists",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}