using System;

namespace ConsoleApp21
{
    class Program
    {
        //X=5
        //X=5 Y=-10
        //X=5 Y=-10 Z=15
        //X=5
        //X=1 Y=-5
        //X=20
        //X=10 Y=-10
        //X=15 Y=-30 Z=45
        //X=20
        //X=2 Y=-5
        static void Main(string[] args)
        {
           
         }
    }
    public class Area
    {
            public string Color { get; set; } 
            public int AvailableSpots { get; set; } 
            public List<string> ParkedCars { get; set; } 
    }

    public class Floor
    {
        private int floorNumber;
        private List<Area> areasa;

        public Floor(int floorNumber, List<Area> areasa)
        {
            this.floorNumber = floorNumber;
            this.areasa = areasa;
        }


        private string ParkCar(string licensePlate)
        {
            foreach (Area area in areasa)
            {
                if (area.AvailableSpots > 0)
                {
                    area.ParkedCars.Add(licensePlate);
                    area.AvailableSpots--;
                    return area.Color;
                }
            }
            return "room no";
        }
    }
        public class Parking
        {
            private Floor[] floors;

            public Parking(Floor[] floors)
            {
                this.floors = floors;
            }

            
            public string AddCar(string licensePlate)
            {
                foreach (Floor floor in floors)
                {
                    string result = floor.ParkCar(licensePlate);
                    if (result != "room no")
                    {
                        return $"Car with license plate {licensePlate} parked in {result} area.";
                    }
                }
                return "No available parking spots.";
            }
        }
    
}
