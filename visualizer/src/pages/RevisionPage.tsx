import { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import { format, parse } from "date-fns";
import { Link } from "react-router-dom";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface RevisionRow {
  Topic: string;
  Problem: string;
  Pattern: string;
  "Core Idea": string;
  "Date Solved": string;
  "Confidence (1-5)": string;
  "Last Reviewed": string;
  "Next Review": string;
  "Review Count": string;
  "Notes/Tricky Part": string;
  Link: string;
}

export default function RevisionPage() {
  const [data, setData] = useState<RevisionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/csv")
      .then((res) => res.text())
      .then((csvText) => {
        const parsed = Papa.parse<RevisionRow>(csvText, {
          header: true,
          skipEmptyLines: true,
        });
        setData(parsed.data);
        setLoading(false);
      });
  }, []);

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const toReviseToday = useMemo(() => {
    return data
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => {
        if (!row["Next Review"]) return true;
        return row["Next Review"] <= todayStr;
      });
  }, [data, todayStr]);

  const updateRow = (
    indexInData: number,
    field: keyof RevisionRow,
    value: string,
  ) => {
    const newData = [...data];
    newData[indexInData] = { ...newData[indexInData], [field]: value };
    setData(newData);
  };

  const setNextReviewDate = (indexInData: number, daysToAdd: number) => {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd);
    setNextReviewDateExact(indexInData, nextDate);
  };

  const setNextReviewDateExact = (indexInData: number, nextDate: Date) => {
    const nextDateStr = format(nextDate, "yyyy-MM-dd");

    const newData = [...data];
    newData[indexInData] = {
      ...newData[indexInData],
      "Next Review": nextDateStr,
      "Last Reviewed": todayStr,
      "Review Count": String(
        parseInt(newData[indexInData]["Review Count"] || "0") + 1,
      ),
    };
    setData(newData);
  };

  const handleSave = async () => {
    setSaving(true);
    const csvStr = Papa.unparse(data);
    await fetch("/api/csv", {
      method: "POST",
      body: csvStr,
    });
    setSaving(false);
    alert("Changes saved successfully to dsa-revision.csv");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas text-ink font-sans">
        <div className="font-mono text-sm">Loading revisions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans antialiased pb-20">
      {/* Header matching TraceDSA.dc.html */}
      <header className="flex h-16 items-center justify-between border-b border-line bg-surface px-7">
        <div className="flex items-center gap-9">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-ink no-underline"
          >
            <span className="grid h-[22px] w-[22px] place-items-center rounded-none bg-ink">
              <span className="h-2 w-2 rounded-none bg-tdsa-accent" />
            </span>
            <span className="text-base font-semibold tracking-[-0.02em]">
              TraceDSA
            </span>
          </Link>
          <nav className="flex gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-muted hover:text-ink no-underline"
            >
              Visualizer
            </Link>
            <span className="text-sm font-medium text-ink">
              Revision Tracker
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-9 items-center rounded-none border border-tdsa-accent bg-tdsa-accent px-4 text-[13px] font-semibold text-white shadow-btn hover:bg-tdsa-accent-hover cursor-pointer disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl py-12 px-8">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-[44px] font-semibold leading-[1.08] tracking-[-0.03em] text-ink mb-2">
              Today's Revisions
            </h1>
            <p className="text-[19px] text-muted">
              You have {toReviseToday.length} algorithms queued for review.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {toReviseToday.map(({ row, index }) => (
            <div
              key={index}
              className="bg-surface border border-line shadow-crisp p-6 rounded-none"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-none border border-line bg-panel px-2.5 py-1 font-mono text-[11px] font-medium text-muted">
                      {row.Topic}
                    </span>
                    <span className="rounded-none border border-line bg-panel px-2.5 py-1 font-mono text-[11px] font-medium text-muted">
                      Reviews: {row["Review Count"] || 0}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {row.Problem}
                  </h2>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-mono text-xs text-subtle uppercase tracking-wider">
                    Confidence
                  </span>
                  <select
                    value={row["Confidence (1-5)"]}
                    onChange={(e) =>
                      updateRow(index, "Confidence (1-5)", e.target.value)
                    }
                    className="border border-line bg-surface p-1 font-mono text-sm shadow-sm cursor-pointer outline-none focus:border-tdsa-accent"
                  >
                    <option value="1">1 - Weak</option>
                    <option value="2">2 - Needs Work</option>
                    <option value="3">3 - Okay</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - Mastered</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[15px] font-medium text-ink mb-1">
                  Pattern:{" "}
                  <span className="font-normal text-muted">{row.Pattern}</span>
                </p>
                <p className="text-[15px] font-medium text-ink">
                  Core Idea:{" "}
                  <span className="font-normal text-muted">
                    {row["Core Idea"]}
                  </span>
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-[13px] font-mono text-subtle uppercase tracking-wider mb-2">
                  Notes / Tricky Parts
                </label>
                <textarea
                  value={row["Notes/Tricky Part"] || ""}
                  onChange={(e) =>
                    updateRow(index, "Notes/Tricky Part", e.target.value)
                  }
                  className="w-full border border-line bg-canvas p-3 text-[14px] text-ink focus:outline-none focus:border-line-strong min-h-[80px] rounded-none resize-y"
                  placeholder="Add your notes here..."
                />
              </div>

              <div className="flex items-center justify-between border-t border-line pt-4">
                <div className="text-[13px] text-muted font-mono">
                  Last reviewed: {row["Last Reviewed"] || "Never"}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-mono text-subtle mr-2 uppercase tracking-wider">
                    Schedule Next
                  </span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="border border-line bg-panel p-1.5 text-ink hover:bg-line-strong cursor-pointer rounded-none flex items-center justify-center"
                        aria-label="Pick a date"
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={
                          row["Next Review"]
                            ? parse(
                                row["Next Review"],
                                "yyyy-MM-dd",
                                new Date(),
                              )
                            : undefined
                        }
                        onSelect={(date) =>
                          date && setNextReviewDateExact(index, date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <button
                    onClick={() => setNextReviewDate(index, 1)}
                    className="border border-line bg-panel px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-line-strong cursor-pointer rounded-none"
                  >
                    +1 Day
                  </button>
                  <button
                    onClick={() => setNextReviewDate(index, 3)}
                    className="border border-line bg-panel px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-line-strong cursor-pointer rounded-none"
                  >
                    +3 Days
                  </button>
                  <button
                    onClick={() => setNextReviewDate(index, 7)}
                    className="border border-line bg-panel px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-line-strong cursor-pointer rounded-none"
                  >
                    +1 Week
                  </button>
                </div>
              </div>
            </div>
          ))}

          {toReviseToday.length === 0 && (
            <div className="bg-surface border border-line border-dashed p-12 text-center rounded-none">
              <h3 className="text-xl font-semibold text-ink mb-2">
                All caught up!
              </h3>
              <p className="text-muted">
                You have no algorithms scheduled for revision today.
              </p>
            </div>
          )}
        </div>

        <div className="mt-20 border-t border-line pt-12">
          <h2 className="text-3xl font-semibold tracking-tight text-ink mb-2">
            All Topics
          </h2>
          <p className="text-muted mb-8">
            Click a row to edit its details and schedule a revision.
          </p>

          <div className="flex flex-col border-t border-line">
            {data.map((row, index) => (
              <div
                key={index}
                onClick={() => setEditingIndex(index)}
                className="flex items-center justify-between p-4 border-b border-line hover:bg-panel cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-subtle w-8">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-ink">
                      {row.Problem}
                    </h3>
                    <div className="text-[13px] text-muted flex gap-3 mt-1">
                      <span>{row.Topic}</span>
                      <span>·</span>
                      <span className="font-mono">
                        Rev: {row["Review Count"] || 0}
                      </span>
                      <span>·</span>
                      <span className="font-mono">
                        Next: {row["Next Review"] || "None"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {row["Confidence (1-5)"] && (
                    <span className="border border-line bg-surface px-2 py-0.5 text-[11px] font-mono text-muted">
                      Conf: {row["Confidence (1-5)"]}
                    </span>
                  )}
                  <span className="text-tdsa-accent text-lg font-mono">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Sheet
        open={editingIndex !== null}
        onOpenChange={(open) => {
          if (!open) setEditingIndex(null);
        }}
      >
        <SheetContent
          side="bottom"
          className="sm:max-w-none h-[80vh] flex flex-col p-0"
        >
          <SheetHeader className="border-b border-line p-6 shrink-0 bg-panel items-start">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-none border border-line bg-surface px-2.5 py-1 font-mono text-[11px] font-medium text-muted">
                {editingIndex !== null ? data[editingIndex].Topic : ""}
              </span>
              <span className="rounded-none border border-line bg-surface px-2.5 py-1 font-mono text-[11px] font-medium text-muted">
                Reviews:{" "}
                {editingIndex !== null
                  ? data[editingIndex]["Review Count"] || 0
                  : 0}
              </span>
            </div>
            <SheetTitle className="text-2xl font-semibold tracking-tight text-left">
              {editingIndex !== null ? data[editingIndex].Problem : ""}
            </SheetTitle>
          </SheetHeader>
          <div className="p-6 flex-1 overflow-y-auto bg-canvas">
            {editingIndex !== null && (
              <div className="max-w-4xl mx-auto flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <p className="text-[15px] font-medium text-ink">
                      Pattern:{" "}
                      <span className="font-normal text-muted">
                        {data[editingIndex].Pattern}
                      </span>
                    </p>
                    <p className="text-[15px] font-medium text-ink">
                      Core Idea:{" "}
                      <span className="font-normal text-muted">
                        {data[editingIndex]["Core Idea"]}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-mono text-xs text-subtle uppercase tracking-wider">
                      Confidence
                    </span>
                    <select
                      value={data[editingIndex]["Confidence (1-5)"]}
                      onChange={(e) =>
                        updateRow(
                          editingIndex,
                          "Confidence (1-5)",
                          e.target.value,
                        )
                      }
                      className="border border-line bg-surface p-1 font-mono text-sm shadow-sm cursor-pointer outline-none focus:border-tdsa-accent"
                    >
                      <option value="1">1 - Weak</option>
                      <option value="2">2 - Needs Work</option>
                      <option value="3">3 - Okay</option>
                      <option value="4">4 - Good</option>
                      <option value="5">5 - Mastered</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-mono text-subtle uppercase tracking-wider mb-2">
                    Notes / Tricky Parts
                  </label>
                  <textarea
                    value={data[editingIndex]["Notes/Tricky Part"] || ""}
                    onChange={(e) =>
                      updateRow(
                        editingIndex,
                        "Notes/Tricky Part",
                        e.target.value,
                      )
                    }
                    className="w-full border border-line bg-surface p-3 text-[14px] text-ink focus:outline-none focus:border-line-strong min-h-[120px] rounded-none resize-y"
                    placeholder="Add your notes here..."
                  />
                </div>

                <div className="flex items-center justify-between border-t border-line pt-6 mt-2">
                  <div className="text-[13px] text-muted font-mono">
                    Last reviewed:{" "}
                    {data[editingIndex]["Last Reviewed"] || "Never"}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-mono text-subtle mr-2 uppercase tracking-wider">
                      Schedule Next
                    </span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className="border border-line bg-panel p-1.5 text-ink hover:bg-line-strong cursor-pointer rounded-none flex items-center justify-center"
                          aria-label="Pick a date"
                        >
                          <CalendarIcon className="h-4 w-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        {/* @ts-ignore */}
                        <Calendar
                          mode="single"
                          selected={
                            data[editingIndex]["Next Review"]
                              ? parse(
                                  data[editingIndex]["Next Review"],
                                  "yyyy-MM-dd",
                                  new Date(),
                                )
                              : undefined
                          }
                          onSelect={(date) =>
                            date && setNextReviewDateExact(editingIndex, date)
                          }
                          /* @ts-ignore */
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <button
                      onClick={() => setNextReviewDate(editingIndex, 1)}
                      className="border border-line bg-panel px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-line-strong cursor-pointer rounded-none"
                    >
                      +1 Day
                    </button>
                    <button
                      onClick={() => setNextReviewDate(editingIndex, 3)}
                      className="border border-line bg-panel px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-line-strong cursor-pointer rounded-none"
                    >
                      +3 Days
                    </button>
                    <button
                      onClick={() => setNextReviewDate(editingIndex, 7)}
                      className="border border-line bg-panel px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-line-strong cursor-pointer rounded-none"
                    >
                      +1 Week
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
